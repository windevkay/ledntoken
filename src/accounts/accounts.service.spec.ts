import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AccountsService } from './accounts.service';
import { TransactionsService } from '../transactions/transactions.service';

import { Account } from './schema/account.schema';
import { TRANSACTION_TYPE } from '../transactions/schema/transaction.schema';

import { mockAccount, mockAccountID } from '../../test/mocks';
import { Errors } from '../errors';
import { SuccessResponse } from '../responses';

describe('AccountsService', () => {
  let service: AccountsService;
  let transactionsService: TransactionsService;
  let model: Model<Account>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getModelToken('Account'),
          useValue: {
            findById: jest.fn().mockResolvedValue(mockAccount),
            updateOne: jest.fn().mockResolvedValue(''),
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            getBalanceForAccount: jest.fn().mockResolvedValue(10),
            initiateTransaction: jest.fn().mockResolvedValue(''),
            initiateTransfer: jest
              .fn()
              .mockResolvedValue({ creditId: '', debitId: '' }),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    model = module.get<Model<Account>>(getModelToken('Account'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccountInformation', () => {
    it('should return an account property as part of its result', async () => {
      const result = await service.getAccountInformation({
        accountId: mockAccountID,
      });

      expect(transactionsService.getBalanceForAccount).toHaveBeenCalled();
      expect(model.findById).toHaveBeenCalled();
      expect(result.account).toBeDefined();
    });

    it('should return a balance property as part of its result', async () => {
      const result = await service.getAccountInformation({
        accountId: mockAccountID,
      });

      expect(transactionsService.getBalanceForAccount).toHaveBeenCalled();
      expect(model.findById).toHaveBeenCalled();
      expect(result.balance).toBeDefined();
    });

    it('should throw an expected error if something goes wrong', async () => {
      await expect(
        service.getAccountInformation({ accountId: '' }),
      ).rejects.toEqual(Errors.getAccountInformation);
    });
  });

  describe('creditOrDebitAccount', () => {
    it('should return a success response on success', async () => {
      const result = await service.creditOrDebitAccount({
        accountId: mockAccountID,
        type: TRANSACTION_TYPE.receive,
        amount: 10,
      });

      expect(transactionsService.initiateTransaction).toHaveBeenCalled();
      expect(model.updateOne).toHaveBeenCalled();
      expect(result).toEqual(SuccessResponse.creditOrDebitAccount);
    });

    it('should throw an expected error if something goes wrong', async () => {
      await expect(
        service.creditOrDebitAccount({
          accountId: '',
          type: TRANSACTION_TYPE.receive,
          amount: 10,
        }),
      ).rejects.toEqual(Errors.creditOrDebitAccount);
    });
  });

  describe('performTransfer', () => {
    it('should return a success response on success', async () => {
      const result = await service.performTransfer({
        from: mockAccountID,
        to: mockAccountID,
        amount: 10,
      });

      expect(model.findById).toHaveBeenCalled();
      expect(transactionsService.initiateTransfer).toHaveBeenCalled();
      expect(model.updateOne).toHaveBeenCalled();
      expect(result).toEqual(SuccessResponse.performTransfer);
    });

    it('should throw an expected error if something goes wrong', async () => {
      await expect(
        service.performTransfer({
          from: '',
          to: '',
          amount: 10,
        }),
      ).rejects.toEqual(Errors.performTransfer);
    });
  });
});

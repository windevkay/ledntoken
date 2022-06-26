import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TransactionsService } from './transactions.service';

import { Transaction, TRANSACTION_TYPE } from './schema/transaction.schema';

import {
  mockAccountID,
  mockReceivedAmount,
  mockSentAmount,
} from '../../test/mocks';
import { Errors } from '../errors';

class TransactionModel {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  static aggregate = jest.fn().mockResolvedValue([
    { _id: TRANSACTION_TYPE.send, sum_val: mockSentAmount },
    { _id: TRANSACTION_TYPE.receive, sum_val: mockReceivedAmount },
  ]);
  save = jest.fn().mockResolvedValue({ _id: mockAccountID });
}

describe('TransactionsService', () => {
  let service: TransactionsService;
  let model: Model<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken('Transaction'),
          useValue: TransactionModel,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    model = module.get<Model<Transaction>>(getModelToken('Transaction'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalanceForAccount', () => {
    it('should return a balance on success', async () => {
      const result = await service.getBalanceForAccount(mockAccountID);

      expect(model.aggregate).toHaveBeenCalled();
      expect(typeof result).toBe('number');
    });

    it('should return a mathematically correct value', async () => {
      const result = await service.getBalanceForAccount(mockAccountID);

      expect(model.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockReceivedAmount - mockSentAmount);
    });

    it('should throw an expected error if something goes wrong', async () => {
      await expect(service.getBalanceForAccount('')).rejects.toEqual(
        Errors.getBalanceForAccount,
      );
    });
  });

  describe('initiateTransfer', () => {
    it('should return an object with a creditId and a debitId', async () => {
      const result = await service.initiateTransfer({
        from: mockAccountID,
        to: mockAccountID,
        amount: 10,
      });

      expect(result.creditId).toBeDefined();
      expect(result.debitId).toBeDefined();
    });

    it('should throw an expected error if something goes wrong', async () => {
      await expect(
        service.initiateTransfer({
          from: '',
          to: '',
          amount: 10,
        }),
      ).rejects.toEqual(Errors.initiateTransfer);
    });
  });

  describe('initiateTransaction', () => {
    it('should return a string representing a new transaction ID', async () => {
      const result = await service.initiateTransaction({
        accountId: mockAccountID,
        amount: 10,
        type: TRANSACTION_TYPE.send,
      });

      expect(typeof result).toBe('string');
    });

    it('should throw an expected error if something goes wrong', async () => {
      await expect(
        service.initiateTransaction({
          accountId: '',
          amount: 10,
          type: TRANSACTION_TYPE.send,
        }),
      ).rejects.toEqual(Errors.initiateTransaction);
    });
  });
});

import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account, AccountDocument } from './schema/account.schema';
import {
  QueryAccountInput,
  AccountInformation,
  CreateTransactionInput,
  CreateTransferInput,
} from '../types';

import { TransactionsService } from '../transactions/transactions.service';

import { SuccessResponse } from '../responses';
import { Errors } from '../errors';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private transactionsService: TransactionsService,
  ) {}

  getAccountInformation = async (
    input: QueryAccountInput,
  ): Promise<AccountInformation> => {
    try {
      const { accountId } = input;
      const account = await this._middlewareGetAccount(accountId);
      const balance = await this.transactionsService.getBalanceForAccount(
        accountId,
      );
      return Promise.resolve({ account, balance });
    } catch (error) {
      return Promise.reject(Errors.getAccountInformation);
    }
  };

  creditOrDebitAccount = async (
    input: CreateTransactionInput,
  ): Promise<string> => {
    try {
      const { accountId } = input;
      const transactionId = await this.transactionsService.initiateTransaction(
        input,
      );
      await this._middlewareUpdateAccountTransactions(accountId, transactionId);
      return Promise.resolve(SuccessResponse.creditOrDebitAccount);
    } catch (error) {
      return Promise.reject(Errors.creditOrDebitAccount);
    }
  };

  performTransfer = async (input: CreateTransferInput): Promise<string> => {
    try {
      const { from, to, amount } = input;
      const userForCredit = await this._middlewareGetAccount(to);
      const userForDebit = await this._middlewareGetAccount(from);
      const transferDetails = await this.transactionsService.initiateTransfer({
        from: userForDebit._id.toString(),
        to: userForCredit._id.toString(),
        amount,
      });
      await this._middlewareUpdateAccountTransactions(
        to,
        transferDetails.creditId,
      );
      await this._middlewareUpdateAccountTransactions(
        from,
        transferDetails.debitId,
      );
      return Promise.resolve(SuccessResponse.performTransfer);
    } catch (error) {
      return Promise.reject(Errors.performTransfer);
    }
  };

  private _middlewareGetAccount = async (
    accountId: string,
  ): Promise<Account> => {
    try {
      const account = await this.accountModel.findById(
        new Types.ObjectId(accountId),
      );
      return Promise.resolve(account);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  private _middlewareUpdateAccountTransactions = async (
    accountId: string,
    transactionId: string,
  ) => {
    try {
      return await this.accountModel.updateOne(
        { _id: new Types.ObjectId(accountId) },
        { $addToSet: { transactions: transactionId } },
      );
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

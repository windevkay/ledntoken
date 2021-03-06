/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  Transaction,
  TransactionDocument,
  TRANSACTION_TYPE,
} from './schema/transaction.schema';

import { TransferInformation } from '../types';
import { Errors } from '../errors';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  getBalanceForAccount = async (accountId: string): Promise<number> => {
    try {
      const id = new Types.ObjectId(accountId);
      const sums = await this.transactionModel.aggregate([
        // @ts-ignore
        { $match: { user: id } },
        { $group: { _id: '$type', sum_val: { $sum: '$amount' } } },
      ]);
      const receiveTotals = sums.find(
        (transaction) => transaction._id === TRANSACTION_TYPE.receive,
      );
      const sentTotals = sums.find(
        (transaction) => transaction._id === TRANSACTION_TYPE.send,
      );
      return Promise.resolve(receiveTotals.sum_val - sentTotals.sum_val);
    } catch (error) {
      return Promise.reject(Errors.getBalanceForAccount);
    }
  };

  initiateTransfer = async (params: {
    from: string;
    to: string;
    amount: number;
  }): Promise<TransferInformation> => {
    try {
      const { from, to, amount } = params;
      const creditTransactionId = await this.initiateTransaction({
        accountId: to,
        amount,
        type: TRANSACTION_TYPE.receive,
      });
      const debitTransactionId = await this.initiateTransaction({
        accountId: from,
        amount,
        type: TRANSACTION_TYPE.send,
      });
      return Promise.resolve({
        creditId: creditTransactionId,
        debitId: debitTransactionId,
      });
    } catch (error) {
      return Promise.reject(Errors.initiateTransfer);
    }
  };

  initiateTransaction = async (params: {
    accountId: string;
    amount: number;
    type: TRANSACTION_TYPE;
  }): Promise<string> => {
    try {
      const { accountId, amount, type } = params;
      const transaction = new this.transactionModel();
      transaction._id = new Types.ObjectId();
      // @ts-ignore
      transaction.user = new Types.ObjectId(accountId);
      transaction.amount = amount;
      transaction.type = type;
      transaction.createdAt = new Date().toString();
      const savedTransaction = await transaction.save();
      return Promise.resolve(savedTransaction._id);
    } catch (error) {
      return Promise.reject(Errors.initiateTransaction);
    }
  };
}

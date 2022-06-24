import * as fs from 'fs';
import * as path from 'path';

import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

import { Account, AccountDocument } from '../accounts/schema/account.schema';
import {
  Transaction,
  TransactionDocument,
} from '../transactions/schema/transaction.schema';

enum MFA {
  TOTP = 'TOTP',
  SMS = 'SMS',
}

interface account {
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  dob: string;
  mfa?: MFA;
  createdAt: string;
  updatedAt: string;
  referredBy?: string;
}

export enum TRANSACTION_TYPE {
  send = 'send',
  receive = 'receive',
}
interface transaction {
  userEmail: string;
  amount: number;
  type: TRANSACTION_TYPE;
  createdAt: string;
}

@Injectable()
export class LednOrmService {
  private _accountsDataPath = 'src/ledn-orm/accounts-api.json';
  private _transactionsDataPath = 'src/ledn-orm/transactions-api.json';

  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  testone = () => {
    const filePath = path.join(process.cwd(), this._accountsDataPath);
    return new Promise((resolve, reject) => {
      try {
        const stream = fs.createReadStream(filePath, { emitClose: true });
        stream
          .pipe(parser())
          .pipe(streamArray())
          .on('data', async (d) => {
            const data: account = d.value;
            const ax = new this.accountModel();
            ax._id = new ObjectId();
            ax.firstName = data.firstName;
            ax.lastName = data.lastName;
            ax.country = data.country;
            ax.email = data.email;
            ax.dob = data.dob;
            ax.mfa = data.mfa;
            ax.createdAt = data.createdAt;
            ax.updatedAt = data.updatedAt;
            ax.referredBy = data.referredBy;
            await ax.save();
          })
          .on('close', () => {
            return resolve('done');
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  testtwo = () => {
    const filePath = path.join(process.cwd(), this._transactionsDataPath);
    return new Promise((resolve, reject) => {
      try {
        const stream = fs.createReadStream(filePath, { emitClose: true });
        stream
          .pipe(parser())
          .pipe(streamArray())
          .on('data', async (d) => {
            const data: transaction = d.value;
            const { userEmail, amount, type, createdAt } = data;
            const result = await this.accountModel.findOne({
              email: userEmail,
            });
            if (result) {
              const tx = new this.transactionModel();
              tx._id = new ObjectId();
              tx.user = result._id;
              tx.amount = amount;
              tx.type = type;
              tx.createdAt = createdAt;
              const saved = await tx.save();
              await this.accountModel.updateOne(
                { _id: result._id },
                { $addToSet: { transactions: saved._id } },
              );
            }

            //return resolve('done');
          })
          .on('close', () => {
            return resolve('done');
          });
      } catch (error) {
        reject(error);
      }
    });
  };
}

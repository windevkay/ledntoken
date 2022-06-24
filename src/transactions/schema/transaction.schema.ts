import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Account } from '../../accounts/schema/account.schema';

export type TransactionDocument = Transaction & Document;

export enum TRANSACTION_TYPE {
  send = 'send',
  receive = 'receive',
}

@Schema()
export class Transaction {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Account' })
  user: Account;

  @Prop()
  amount: number;

  @Prop()
  type: TRANSACTION_TYPE;

  @Prop()
  createdAt: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

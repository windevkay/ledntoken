import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Transaction } from '../../transactions/schema/transaction.schema';

export type AccountDocument = Account & Document;

enum MFA {
  TOTP = 'TOTP',
  SMS = 'SMS',
}

@Schema()
export class Account {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: [Types.ObjectId], ref: 'Transaction' })
  transactions: Transaction[];

  @Prop()
  country: string;

  @Prop()
  email: string;

  @Prop()
  dob: string;

  @Prop()
  mfa?: MFA;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  referredBy?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';

import { Account } from '../src/accounts/schema/account.schema';

export const mockAccount: Account = {
  _id: new Types.ObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  dob: faker.datatype.string(),
  createdAt: faker.datatype.datetime().toString(),
  updatedAt: faker.datatype.datetime().toString(),
  transactions: [],
  country: faker.address.country(),
  email: faker.internet.email(),
};

export const mockAccountID = '62b630f90b79300484f793c4';
export const mockReceivedAmount = 15;
export const mockSentAmount = 10;

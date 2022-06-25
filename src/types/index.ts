import { Account } from '../accounts/schema/account.schema';
import { TRANSACTION_TYPE } from '../transactions/schema/transaction.schema';

export class QueryAccountInput {
  accountId: string;
}

export class CreateTransactionInput {
  accountId: string;
  amount: number;
  type: TRANSACTION_TYPE;
}

export class CreateTransferInput {
  from: string;
  to: string;
  amount: number;
}

export interface AccountInformation {
  account: Account;
  balance: number;
}

export interface TransferInformation {
  creditId: string;
  debitId: string;
}

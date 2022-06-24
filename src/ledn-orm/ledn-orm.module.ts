import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LednOrmService } from './ledn-orm.service';
import { SeedController } from './seed.controller';

import { Account, AccountSchema } from '../accounts/schema/account.schema';
import {
  Transaction,
  TransactionSchema,
} from '../transactions/schema/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [LednOrmService],
  controllers: [SeedController],
  exports: [LednOrmService],
})
export class LednOrmModule {}

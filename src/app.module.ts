import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LednOrmModule } from './ledn-orm/ledn-orm.module';

@Module({
  imports: [AccountsModule, TransactionsModule, LednOrmModule],
})
export class AppModule {}

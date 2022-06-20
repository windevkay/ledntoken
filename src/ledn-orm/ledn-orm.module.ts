import { Module } from '@nestjs/common';
import { LednOrmService } from './ledn-orm.service';
import { LednOrmController } from './ledn-orm.controller';

@Module({
  controllers: [LednOrmController],
  providers: [LednOrmService]
})
export class LednOrmModule {}

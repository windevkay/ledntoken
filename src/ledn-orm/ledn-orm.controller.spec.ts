import { Test, TestingModule } from '@nestjs/testing';
import { LednOrmController } from './ledn-orm.controller';
import { LednOrmService } from './ledn-orm.service';

describe('LednOrmController', () => {
  let controller: LednOrmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LednOrmController],
      providers: [LednOrmService],
    }).compile();

    controller = module.get<LednOrmController>(LednOrmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

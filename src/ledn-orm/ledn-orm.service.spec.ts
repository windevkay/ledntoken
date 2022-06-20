import { Test, TestingModule } from '@nestjs/testing';
import { LednOrmService } from './ledn-orm.service';

describe('LednOrmService', () => {
  let service: LednOrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LednOrmService],
    }).compile();

    service = module.get<LednOrmService>(LednOrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

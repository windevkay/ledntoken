import { Controller } from '@nestjs/common';
import { LednOrmService } from './ledn-orm.service';

@Controller('ledn-orm')
export class LednOrmController {
  constructor(private readonly lednOrmService: LednOrmService) {}
}

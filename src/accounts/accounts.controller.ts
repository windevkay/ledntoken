import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';

import {
  QueryAccountInput,
  CreateTransactionInput,
  CreateTransferInput,
} from '../types';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('get-account-information')
  @HttpCode(200)
  async getAccountInformation(@Body() queryInput: QueryAccountInput) {
    try {
      return await this.accountsService.getAccountInformation(queryInput);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Post('credit-debit-account')
  async creditOrDebitAccount(@Body() transactionInput: CreateTransactionInput) {
    try {
      return await this.accountsService.creditOrDebitAccount(transactionInput);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Post('perform-transfer')
  async performTransfer(@Body() transferInput: CreateTransferInput) {
    try {
      return await this.accountsService.performTransfer(transferInput);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

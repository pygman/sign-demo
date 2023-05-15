import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PriceDto, RandomDto } from './dto';
import { PriceResult, RandomResult } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/price')
  async price(@Body() dto: PriceDto): Promise<PriceResult> {
    console.log('get price :', dto);
    return await this.appService.price(dto);
  }

  @Post('/random')
  random(@Body() dto: RandomDto): Promise<RandomResult> {
    return this.appService.random(dto);
  }
}

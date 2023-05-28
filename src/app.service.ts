import { Injectable } from '@nestjs/common';
import { PriceDto, RandomDto } from './dto';
import { getIfoContract } from './contract';
import { ethers } from 'ethers';
import { ManagerType } from './generated/Manager';
import { PriceResult, RandomResult } from './types';
import * as process from 'process';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  private poseZbcPrice = ethers.parseEther('0.0000101');
  private txDeadline = 1000000;

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async price(dto: PriceDto): Promise<PriceResult> {
    const buyBoxParam: ManagerType.BuyBoxParamStruct = {
      ...dto,
      poseZbcPrice: this.poseZbcPrice,
      txDeadline: this.txDeadline,
    };
    const digest = await getIfoContract().Manager.calcBuyBoxParam(buyBoxParam);
    const signingKey = new ethers.SigningKey(process.env.SERVER_PK);
    const signature = signingKey.sign(digest);
    return {
      poseZbcPrice: this.poseZbcPrice.toString(),
      txDeadline: this.txDeadline,
      signature: signature.serialized,
    };
  }

  // who, openBoxTicketId
  async random(dto: RandomDto): Promise<RandomResult> {
    const key = `random:${dto.who}:${dto.openBoxTicketId}`;
    const ran = await this.redis.get(key);
    let random;
    if (ran) {
      random = parseInt(ran);
    } else {
      random = Math.round(Math.random() * 10 ** 8);
      await this.redis.set(key, random.toString());
    }
    const openBoxContinueParam: ManagerType.OpenBoxContinueParamStruct = {
      ...dto,
      random,
    };
    const digest = await getIfoContract().Manager.calcOpenBoxContinueParam(
      openBoxContinueParam,
    );
    const signingKey = new ethers.SigningKey(process.env.SERVER_PK);
    const signature = signingKey.sign(digest);
    return { random, signature: signature.serialized };
  }
}

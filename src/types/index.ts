import { Manager } from '../generated';
import { BigNumberish } from 'ethers';

export type NameMapping = {
  Manager: string;
};

export type IfoContract = {
  Manager: Manager;
};

export type PriceResult = {
  poseZbcPrice: BigNumberish;
  txDeadline: BigNumberish;
  signature: string;
};

export type RandomResult = {
  random: BigNumberish;
  signature: string;
};

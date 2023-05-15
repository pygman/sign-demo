import {
  Manager__factory,
  NameService__factory,
} from './generated';
import { decodeBytes32String, ethers } from 'ethers';
import { IfoContract, NameMapping } from './types';

let ifoContract: IfoContract | null = null;

export function getIfoContract(): IfoContract {
  return ifoContract!;
}

export async function mappingInit() {
  const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL!);
  const nameService = NameService__factory.connect(
    process.env.NAME_SERVICE_ADDRESS!,
    provider,
  );
  const services = await nameService.listSingleEntries();
  const mapping = services.reduce(
    (mapping, item) =>
      Object.assign(mapping, { [decodeBytes32String(item.name)]: item.addr }),
    {} as NameMapping,
  );
  ifoContract = {
    Manager: Manager__factory.connect(mapping!.Manager!, provider),
  };
}

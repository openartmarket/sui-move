import type { Executor } from "./Executor";
import { getCreatedObjects } from "./helpers";
import type { Currency } from "./types";

export type MintContractParams = {
  adminCapId: string;
  totalShareCount: number;
  sharePrice: number;
  outgoingPrice: number;
  name: string;
  artist: string;
  creationTimestampMillis: number;
  description: string;
  currency: Currency;
  image: string;
};

export type MintContractResult = {
  contractId: string;
  digest: string;
};

export async function mintContract(
  executor: Executor,
  params: MintContractParams,
): Promise<MintContractResult> {
  const {
    adminCapId,
    totalShareCount,
    sharePrice,
    outgoingPrice,
    name,
    artist,
    creationTimestampMillis,
    description,
    currency,
    image,
  } = params;
  const response = await executor.execute((txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::mint_contract`,
      arguments: [
        txb.object(adminCapId),
        txb.pure(totalShareCount),
        txb.pure(sharePrice),
        txb.pure(outgoingPrice),
        txb.pure(name),
        txb.pure(artist),
        txb.pure(creationTimestampMillis),
        txb.pure(description),
        txb.pure(currency),
        txb.pure(image),
      ],
    });
  });
  const { digest } = response;
  const objects = getCreatedObjects(response);
  if (objects.length !== 1) throw new Error(`Expected 1 contract, got ${JSON.stringify(objects)}`);
  const contractId = objects[0].objectId;

  return { contractId, digest };
}

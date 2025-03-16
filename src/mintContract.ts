import { getCreatedObjects } from "./getters.js";
import type { Currency } from "./types.js";
import type { Wallet } from "./Wallet.js";

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
  productId: string;
};

export type MintContractResult = {
  contractId: string;
  digest: string;
};

export async function mintContract(
  wallet: Wallet,
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
    productId,
  } = params;
  const response = await wallet.execute(async (txb, packageId) => {
    txb.moveCall({
      target: `${packageId}::open_art_market::mint_contract`,
      arguments: [
        txb.object(adminCapId),
        txb.pure.u64(totalShareCount),
        txb.pure.u64(sharePrice),
        txb.pure.u64(outgoingPrice),
        txb.pure.string(name),
        txb.pure.string(artist),
        txb.pure.u64(creationTimestampMillis),
        txb.pure.string(description),
        txb.pure.string(currency),
        // AKA reference AKA image
        txb.pure.string(productId),
      ],
    });
  });
  const { digest } = response;
  const objects = getCreatedObjects(response);
  if (objects.length !== 1) throw new Error(`Expected 1 contract, got ${JSON.stringify(objects)}`);
  const contractId = objects[0].objectId;

  return { contractId, digest };
}

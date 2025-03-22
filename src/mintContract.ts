import type { Wallet } from "./Wallet.js";
import { getCreatedObjects } from "./getters.js";
import { queryAllTransactions } from "./queryAllTransactions.js";
import type { Currency } from "./types.js";

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

/**
 * Mint a new contract.
 *
 * This function is idempotent. If a contract with the same parameters already exists on the chain, it will be returned.
 *
 * @param wallet - The wallet to use to mint the contract.
 * @param params - The parameters for the contract.
 * @returns The result of the minting.
 */
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

  const responses = await queryAllTransactions(wallet.suiClient, {
    filter: {
      MoveFunction: {
        function: "mint_contract",
        module: "open_art_market",
        package: wallet.packageId,
      },
    },
    options: {
      showInput: true,
      showObjectChanges: true,
    },
  });

  const expected = [
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
  ].map((value) => value.toString());

  let response = responses.find((res) => {
    if (res.transaction?.data?.transaction?.kind === "ProgrammableTransaction") {
      const inputs = res.transaction.data.transaction.inputs;
      const inputValues = inputs.map((input) => {
        if (input.type === "pure") {
          return input.value;
        }
        return input.objectId;
      });
      return inputValues.every((value, index) => value === expected[index]);
    }
    return false;
  });

  if (!response) {
    response = await wallet.execute(async (txb, packageId) => {
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
  }

  const { digest } = response;
  const objects = getCreatedObjects(response);
  if (objects.length !== 1) throw new Error(`Expected 1 contract, got ${JSON.stringify(objects)}`);
  const contractId = objects[0].objectId;

  return { contractId, digest };
}

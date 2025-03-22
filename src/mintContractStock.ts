import type { Wallet } from "./Wallet.js";
import { getAddressOwner, getCreatedObjects } from "./getters.js";
import { queryAllTransactions } from "./queryAllTransactions.js";

export type MintContractStockParams = {
  adminCapId: string;
  contractId: string;
  receiverAddress: string;
  quantity: number;
};

export type MintContractStockResult = {
  contractStockId: string;
  digest: string;
};

/**
 * Mint a new contract stock.
 *
 * This function is idempotent. If a contract stock with the same parameters already exists on the chain, it will be returned.
 *
 * @param wallet - The wallet to use to mint the contract stock.
 * @param params - The parameters for the contract stock.
 * @returns The result of the minting.
 */
export async function mintContractStock(
  wallet: Wallet,
  params: MintContractStockParams,
): Promise<MintContractStockResult> {
  const { adminCapId, contractId, quantity, receiverAddress } = params;

  const responses = await queryAllTransactions(wallet.suiClient, {
    filter: {
      MoveFunction: {
        function: "mint_contract_stock",
        module: "open_art_market",
        package: wallet.packageId,
      },
    },
    options: {
      showInput: true,
      showObjectChanges: true,
    },
  });

  const expected = [adminCapId, contractId, quantity, receiverAddress].map((value) =>
    value.toString(),
  );

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
        target: `${packageId}::open_art_market::mint_contract_stock`,
        arguments: [
          txb.object(adminCapId),
          txb.object(contractId),
          txb.pure.u64(quantity),
          txb.pure.address(receiverAddress),
        ],
      });
    });
  }

  const { digest } = response;
  const objects = getCreatedObjects(response);
  const ownedObjects = objects.filter((obj) => getAddressOwner(obj) !== null);
  if (ownedObjects.length !== 1) {
    throw new Error(`Expected 1 owned objects, got ${JSON.stringify(ownedObjects, null, 2)}`);
  }
  const contractStockId = ownedObjects[0].objectId;
  return { contractStockId, digest };
}

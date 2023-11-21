import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { beforeEach, describe, expect, it } from "vitest";

import type { SuiAddress } from "../src";
import { newAddress } from "../src";
import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { getContractStocks } from "../src/getContractStocks";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { transferContractStock } from "../src/transferContractStock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  mintContractOptions,
  PACKAGE_ID,
} from "./test-helpers";

describe("transferContractStock", () => {
  let executor: Executor;
  const client = getClient();
  let contractId: string;
  let user1: SuiAddress;
  let user2: SuiAddress;
  beforeEach(async () => {
    executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(ADMIN_PHRASE),
      packageId: PACKAGE_ID,
    });
    const res = await mintContract(executor, mintContractOptions);
    contractId = res.contractId;

    user1 = await newAddress();
    user2 = await newAddress();
  });

  it("should transfer ownership", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 12,
      },
    ]);

    const user1Executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(user1.phrase),
      packageId: PACKAGE_ID,
    });
    await transferContractStock(user1Executor, {
      contractId,
      contractStockId,
      toAddress: user2.address,
    });

    const contractStocks = await getContractStocks({
      suiClient: client,
      owner: user2.address,
      contractId,
      packageId: PACKAGE_ID,
    });
    expect(contractStocks).toHaveLength(1);
    expect(contractStocks[0].objectId).toEqual(contractStockId);
  }, 30_000);
});

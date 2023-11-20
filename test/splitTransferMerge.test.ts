import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { beforeEach, describe, expect, it } from "vitest";

import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { splitTransferMerge } from "../src/splitTransferMerge";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  getQuantity,
  mintContractOptions,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
  USER2_ADDRESS,
  USER2_PHRASE,
} from "./test-helpers";

describe("splitTransferMerge", () => {
  let executor: Executor;
  const client = getClient();
  let contractId: string;
  beforeEach(async () => {
    executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(ADMIN_PHRASE),
      packageId: PACKAGE_ID,
    });
    const res = await mintContract(executor, mintContractOptions);
    contractId = res.contractId;
  });

  it("should transfer stocks and make sure everything is merged", async () => {
    // const suiCoinObjectId = await getSuiCoinObjectId();
    // const user1 = await newAddress();
    // await transferSui({ to: user1.address, suiCoinObjectId });
    // const user2 = await newAddress();
    // await transferSui({ to: user2.address, suiCoinObjectId });

    await mintContractStock(executor, [
      // User 1 has bought stocks in 3 batches. Total: 9
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 1,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 3,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 5,
      },
      // User 2 has bought stocks in 2 batches. Total: 16
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER2_ADDRESS,
        quantity: 7,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER2_ADDRESS,
        quantity: 9,
      },
    ]);

    const user1Executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(USER1_PHRASE),
      packageId: PACKAGE_ID,
    });
    const user2Executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(USER2_PHRASE),
      packageId: PACKAGE_ID,
    });

    const { fromContractStockId, toContractStockId } = await splitTransferMerge({
      packageId: PACKAGE_ID,
      fromExecutor: user1Executor,
      toExecutor: user2Executor,
      contractId,
      fromAddress: USER1_ADDRESS,
      toAddress: USER2_ADDRESS,
      quantity: 2,
    });

    expect(await getQuantity(client, fromContractStockId)).toEqual(7);
    expect(await getQuantity(client, toContractStockId)).toEqual(18);

    // TODO: verify that user1 has one stock with 7 and user2 has one stock with 18
  }, 30_000);
});
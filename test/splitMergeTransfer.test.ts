import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { beforeEach, describe, it } from "vitest";

import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { splitMergeTransfer } from "../src/splitMergeTransfer";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  getSuiCoinObjectId,
  mintContractOptions,
  newAddress,
  PACKAGE_ID,
  transferSui,
} from "./test-helpers";

describe("splitMergeTransfer", () => {
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
    const suiCoinObjectId = await getSuiCoinObjectId();
    const user1 = await newAddress();
    await transferSui({ to: user1.address, suiCoinObjectId });
    const user2 = await newAddress();
    await transferSui({ to: user2.address, suiCoinObjectId });

    console.log("Minting stocks...");
    await mintContractStock(executor, [
      // User 1 has bought stocks in 3 batches. Total: 9
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 1,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 3,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 5,
      },
      // User 2 has bought stocks in 2 batches. Total: 16
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user2.address,
        quantity: 7,
      },
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user2.address,
        quantity: 9,
      },
    ]);

    console.log("MINTED STOCKS");

    const user1Executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(user1.phrase),
      packageId: PACKAGE_ID,
    });
    const user2Executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(user2.phrase),
      packageId: PACKAGE_ID,
    });

    await splitMergeTransfer({
      fromExecutor: user1Executor,
      toExecutor: user2Executor,
      contractId,
      fromAddress: user1.address,
      toAddress: user2.address,
      quantity: 2,
    });

    // TODO: verify that user1 has one stock with 7 and user2 has one stock with 18
  }, 30_000);
});

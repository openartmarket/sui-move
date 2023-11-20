import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { beforeEach, describe, expect, it } from "vitest";

import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { transferContractStock } from "../src/transferContractStock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  getOwnedObject,
  mintContractOptions,
  PACKAGE_ID,
  USER1_ADDRESS,
  USER1_PHRASE,
  USER2_ADDRESS,
} from "./test-helpers";

describe("transferContractStock", () => {
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

  it("should transfer ownership", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: USER1_ADDRESS,
        quantity: 12,
      },
    ]);

    const user1Executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(USER1_PHRASE),
      packageId: PACKAGE_ID,
    });
    await transferContractStock(user1Executor, {
      contractId,
      contractStockId,
      toAddress: USER2_ADDRESS,
    });

    const ownedObject = await getOwnedObject(client, USER2_ADDRESS, contractStockId);
    expect(ownedObject).toBeDefined();
  }, 30_000);
});

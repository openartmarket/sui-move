import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { beforeEach, describe, expect, it } from "vitest";

import type { SuiAddress } from "../src";
import { newAddress } from "../src";
import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { splitContractStock } from "../src/splitContractStock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  getQuantity,
  mintContractOptions,
  PACKAGE_ID,
} from "./test-helpers";

describe("splitContractStock", () => {
  let executor: Executor;
  const client = getClient();
  let contractId: string;
  let user1: SuiAddress;
  beforeEach(async function () {
    executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(ADMIN_PHRASE),
      packageId: PACKAGE_ID,
    });
    const res = await mintContract(executor, mintContractOptions);
    contractId = res.contractId;

    user1 = await newAddress();
  }, 20_000);

  it("should split an contract stock", async () => {
    const {
      contractStockIds: [contractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 10,
      },
    ]);

    const user1Executor = new SuiExecutor({
      suiClient: client,
      keypair: Ed25519Keypair.deriveKeypair(user1.phrase),
      packageId: PACKAGE_ID,
    });
    const { splitContractStockId } = await splitContractStock(user1Executor, {
      contractStockId,
      quantity: 2,
    });

    expect(await getQuantity(client, splitContractStockId)).toEqual(2);
    expect(await getQuantity(client, contractStockId)).toEqual(8);
  }, 30_000);

  it("should split a split stock", async () => {
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

    const { splitContractStockId } = await splitContractStock(user1Executor, {
      contractStockId,
      quantity: 5,
    });
    const { splitContractStockId: splitAgainContractStockId } = await splitContractStock(
      user1Executor,
      {
        contractStockId: splitContractStockId,
        quantity: 3,
      },
    );

    expect(await getQuantity(client, contractStockId)).toEqual(7);
    expect(await getQuantity(client, splitContractStockId)).toEqual(2);
    expect(await getQuantity(client, splitAgainContractStockId)).toEqual(3);
  }, 30_000);
});

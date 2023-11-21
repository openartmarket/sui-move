import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { beforeEach, describe, expect, it } from "vitest";

import type { SuiAddress } from "../src";
import { newAddress } from "../src";
import type { Executor } from "../src/Executor";
import { SuiExecutor } from "../src/Executor";
import { mergeContractStock } from "../src/mergeContractStock";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import {
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  getClient,
  getQuantity,
  mintContractOptions,
  PACKAGE_ID,
} from "./test-helpers";

describe("mergeContractStock", () => {
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

  it("should merge contract stocks", async () => {
    const {
      contractStockIds: [toContractStockId],
    } = await mintContractStock(executor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 10,
      },
    ]);

    const {
      contractStockIds: [fromContractStockId],
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
    await mergeContractStock(user1Executor, [
      {
        toContractStockId,
        fromContractStockId,
      },
    ]);

    expect(await getQuantity(client, toContractStockId)).toEqual(20);
    await expect(getQuantity(client, fromContractStockId)).rejects.toSatisfy((err) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(err.code).toEqual("deleted");
      return true;
    });
  }, 30_000);
});

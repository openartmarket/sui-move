import { beforeEach, describe, expect, it } from "vitest";

import type { SuiAddress } from "../src";
import { newAddress } from "../src";
import { mergeContractStock } from "../src/mergeContractStock";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import {
  ADMIN_CAP_ID,
  adminExecutor,
  getQuantity,
  mintContractOptions,
  newUserExecutor,
} from "./test-helpers";

describe("mergeContractStock", () => {
  let contractId: string;
  let user1: SuiAddress;
  beforeEach(async function () {
    const res = await mintContract(adminExecutor, mintContractOptions);
    contractId = res.contractId;

    user1 = await newAddress();
  }, 20_000);

  it("should merge contract stocks", async () => {
    const {
      contractStockIds: [toContractStockId],
    } = await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 10,
      },
    ]);

    const {
      contractStockIds: [fromContractStockId],
    } = await mintContractStock(adminExecutor, [
      {
        adminCapId: ADMIN_CAP_ID,
        contractId,
        receiverAddress: user1.address,
        quantity: 10,
      },
    ]);

    const user1Executor = newUserExecutor(user1);
    await mergeContractStock(user1Executor, [
      {
        toContractStockId,
        fromContractStockId,
      },
    ]);

    expect(await getQuantity(adminExecutor.suiClient, toContractStockId)).toEqual(20);
    await expect(getQuantity(adminExecutor.suiClient, fromContractStockId)).rejects.toSatisfy(
      (err) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(err.code).toEqual("deleted");
        return true;
      },
    );
  }, 30_000);
});

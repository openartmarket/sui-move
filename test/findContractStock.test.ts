import { beforeEach, describe, expect, it } from "vitest";

import type { Wallet } from "../src/Wallet.js";
import { mintContract } from "../src/mintContract.js";
import {
  type MintContractStockParams,
  findContractStock,
  mintContractStock,
} from "../src/mintContractStock.js";
import { ADMIN_CAP_ID, adminWallet, makeMintContractOptions, makeWallet } from "./test-helpers";

describe("mintContractStock", () => {
  let contractId: string;
  let wallet: Wallet;

  beforeEach(async () => {
    const mintContractOptions = makeMintContractOptions();

    const res = await mintContract(adminWallet, mintContractOptions);
    contractId = res.contractId;

    wallet = await makeWallet();
  }, 30_000);

  it("should find a previously minted contract stock", async () => {
    const mintContractStockParams: MintContractStockParams = {
      adminCapId: ADMIN_CAP_ID,
      contractId,
      quantity: 100,
      receiverAddress: wallet.address,
    };

    const stock1 = await mintContractStock(adminWallet, mintContractStockParams);
    const stock2 = await findContractStock(adminWallet, mintContractStockParams);
    expect(stock2).toEqual(stock1);
  });
});

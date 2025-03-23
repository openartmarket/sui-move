import { describe, expect, it } from "vitest";
import { mintContract } from "../src";
import { adminWallet, makeMintContractOptions } from "./test-helpers";

describe("mintContract", () => {
  it("should be idempotent", { timeout: 100_000 }, async () => {
    const mintContractOptions = makeMintContractOptions();

    console.log("minting contract 1");
    const contract1 = await mintContract(adminWallet, mintContractOptions);
    console.log("minting contract 2");
    const contract2 = await mintContract(adminWallet, mintContractOptions);
    expect(contract2).toEqual(contract1);

    const mintContractOptions2 = makeMintContractOptions();
    const contract3 = await mintContract(adminWallet, mintContractOptions2);
    expect(contract3).not.toEqual(contract1);
  });
});

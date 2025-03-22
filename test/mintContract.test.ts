import { describe, expect, it } from "vitest";
import { mintContract } from "../src";
import { adminWallet, makeMintContractOptions } from "./test-helpers";

describe("mintContract", () => {
  it("should be idempotent", async () => {
    const mintContractOptions = makeMintContractOptions();

    const contract1 = await mintContract(adminWallet, mintContractOptions);
    const contract2 = await mintContract(adminWallet, mintContractOptions);
    expect(contract2).toEqual(contract1);

    const mintContractOptions2 = makeMintContractOptions();
    const contract3 = await mintContract(adminWallet, mintContractOptions2);
    expect(contract3).not.toEqual(contract1);
  });
});

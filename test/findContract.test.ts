import { describe, expect, it } from "vitest";
import { findContract, mintContract } from "../src";
import { adminWallet, makeMintContractOptions } from "./test-helpers";

describe("findContract", () => {
  it("should find a previously minted contract", { timeout: 100_000 }, async () => {
    const mintContractOptions = makeMintContractOptions();

    const contract1 = await mintContract(adminWallet, mintContractOptions);
    const contract2 = await findContract(adminWallet, mintContractOptions);
    expect(contract2).toEqual(contract1);
  });
});

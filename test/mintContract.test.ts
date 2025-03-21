import { describe, expect, it } from "vitest";
import { mintContract } from "../src";
import { adminWallet, mintContractOptions } from "./test-helpers";

describe("mintContract", () => {
  it("should be idempotent", async () => {
    const contract1 = await mintContract(adminWallet, mintContractOptions);
    const contract2 = await mintContract(adminWallet, mintContractOptions);
    expect(contract2).toEqual(contract1);
    const contract3 = await mintContract(adminWallet, {
      ...mintContractOptions,
      productId: "mona-lisa-2",
    });
    expect(contract3).not.toEqual(contract1);
  });
});

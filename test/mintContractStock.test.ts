import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { availableStock } from "../src/available_stock";
import { mintContract } from "../src/contract";
import { batchMintContractStock, mintContractStock } from "../src/contract_stock";
import {
  ADMIN_ADDRESS,
  baseOptions,
  mintContractOptions,
  network,
  USER1_ADDRESS,
  USER2_ADDRESS,
  USER3_ADDRESS,
} from "./test-helpers";

describe("mintContractStock", () => {
  let contractId: string;
  beforeEach(async () => {
    contractId = await mintContract(mintContractOptions);
  });

  it("should issue new shares", async () => {
    await mintContractStock({
      ...baseOptions,
      contractId,
      receiverAddress: USER1_ADDRESS,
      shares: 2,
    });
    const sharesLeft = await availableStock({
      contractId,
      network,
    });
    assert.equal(sharesLeft, 498);
  });

  it("should batch issue new shares", async () => {
    const contractId2 = await mintContract(mintContractOptions);
    await batchMintContractStock({
      ...baseOptions,
      list: [
        { contractId: contractId2, receiverAddress: USER1_ADDRESS, shares: 20 },
        { contractId: contractId2, receiverAddress: USER1_ADDRESS, shares: 10 },
        { contractId, receiverAddress: USER1_ADDRESS, shares: 2 },
        { contractId, receiverAddress: USER2_ADDRESS, shares: 3 },
        { contractId, receiverAddress: USER3_ADDRESS, shares: 5 },
      ],
    });
    const sharesLeft = await availableStock({
      contractId,
      network,
    });
    const sharesLeft2 = await availableStock({
      contractId: contractId2,
      network,
    });
    assert.equal(sharesLeft, 490);
    assert.equal(sharesLeft2, 470);
  });

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(
      mintContractStock({
        contractId,
        shares: 501,
        receiverAddress: USER1_ADDRESS,
        ...baseOptions,
      })
    );
  });

  it("should not issue new shares, when sold out", async () => {
    await mintContractStock({
      contractId,
      shares: 150,
      receiverAddress: USER1_ADDRESS,
      ...baseOptions,
    });
    await mintContractStock({
      contractId,
      receiverAddress: USER2_ADDRESS,
      shares: 250,
      ...baseOptions,
    });
    await mintContractStock({
      contractId,
      receiverAddress: USER1_ADDRESS,
      shares: 98,
      ...baseOptions,
    });
    const sharesLeft = await availableStock({
      contractId,
      network,
    });
    assert.equal(sharesLeft, 2);

    await assert.rejects(
      mintContractStock({
        contractId,
        receiverAddress: USER2_ADDRESS,
        shares: 3,
        ...baseOptions,
      })
    );
  }).timeout(30_000);

  it("can give shares to OAM and owner", async () => {
    await mintContractStock({
      contractId,
      receiverAddress: ADMIN_ADDRESS,
      shares: 150,
      ...baseOptions,
    });
    await mintContractStock({
      contractId,
      receiverAddress: USER1_ADDRESS,
      shares: 50,
      ...baseOptions,
    });
    await mintContractStock({
      contractId,
      receiverAddress: USER2_ADDRESS,
      shares: 1,
      ...baseOptions,
    });
  }).timeout(30_000);

  it.skip("can set the outgoing sale price of the contract", async () => {
    assert.ok(false);
  });
  it.skip("can burn the shares after contract is sold", async () => {
    assert.ok(false);
  });
});

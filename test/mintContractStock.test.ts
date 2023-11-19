import assert from "assert";
import { beforeEach, describe, it } from "vitest";

import { mintContract } from "../src/contract";
import { getAvailableStock } from "../src/getAvailableStock";
import { batchMintContractStock, mintContractStock } from "../src/mint_contract_stock";
import {
  ADMIN_ADDRESS,
  baseOptions,
  getClient,
  mintContractOptions,
  USER1_ADDRESS,
  USER2_ADDRESS,
  USER3_ADDRESS,
} from "./test-helpers";

describe("mintContractStock", () => {
  const client = getClient();
  let contractId: string;
  beforeEach(async () => {
    contractId = await mintContract(client, mintContractOptions);
  });

  it("should issue new shares", async () => {
    await mintContractStock(client, {
      ...baseOptions,
      contractId,
      receiverAddress: USER1_ADDRESS,
      quantity: 2,
    });
    const sharesLeft = await getAvailableStock(client, contractId);
    assert.equal(sharesLeft, 498);
  });

  it("should batch issue new shares", async () => {
    const contractId2 = await mintContract(client, mintContractOptions);
    await batchMintContractStock(client, {
      ...baseOptions,
      list: [
        { contractId: contractId2, receiverAddress: USER1_ADDRESS, quantity: 20 },
        { contractId: contractId2, receiverAddress: USER1_ADDRESS, quantity: 10 },
        { contractId, receiverAddress: USER1_ADDRESS, quantity: 2 },
        { contractId, receiverAddress: USER2_ADDRESS, quantity: 3 },
        { contractId, receiverAddress: USER3_ADDRESS, quantity: 5 },
      ],
    });
    const sharesLeft = await getAvailableStock(client, contractId);
    const sharesLeft2 = await getAvailableStock(client, contractId2);
    assert.equal(sharesLeft, 490);
    assert.equal(sharesLeft2, 470);
  });

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(
      mintContractStock(client, {
        contractId,
        quantity: 501,
        receiverAddress: USER1_ADDRESS,
        ...baseOptions,
      }),
    );
  });

  it("should issue remaining shares", async () => {
    await mintContractStock(client, {
      contractId,
      quantity: 498,
      receiverAddress: USER1_ADDRESS,
      ...baseOptions,
    });

    await mintContractStock(client, {
      contractId,
      quantity: 2,
      receiverAddress: USER1_ADDRESS,
      ...baseOptions,
    });

    const sharesLeft = await getAvailableStock(client, contractId);
    assert.equal(sharesLeft, 0);

    await assert.rejects(
      mintContractStock(client, {
        contractId,
        quantity: 1,
        receiverAddress: USER1_ADDRESS,
        ...baseOptions,
      }),
    );
  });

  it("should not issue new shares, when sold out", async () => {
    await mintContractStock(client, {
      contractId,
      quantity: 150,
      receiverAddress: USER1_ADDRESS,
      ...baseOptions,
    });
    await mintContractStock(client, {
      contractId,
      receiverAddress: USER2_ADDRESS,
      quantity: 250,
      ...baseOptions,
    });
    await mintContractStock(client, {
      contractId,
      receiverAddress: USER1_ADDRESS,
      quantity: 98,
      ...baseOptions,
    });
    const sharesLeft = await getAvailableStock(client, contractId);
    assert.equal(sharesLeft, 2);

    await assert.rejects(
      mintContractStock(client, {
        contractId,
        receiverAddress: USER2_ADDRESS,
        quantity: 3,
        ...baseOptions,
      }),
    );
  }, 30_000);

  it("can give shares to OAM and owner", async () => {
    await mintContractStock(client, {
      contractId,
      receiverAddress: ADMIN_ADDRESS,
      quantity: 150,
      ...baseOptions,
    });
    await mintContractStock(client, {
      contractId,
      receiverAddress: USER1_ADDRESS,
      quantity: 50,
      ...baseOptions,
    });
    await mintContractStock(client, {
      contractId,
      receiverAddress: USER2_ADDRESS,
      quantity: 1,
      ...baseOptions,
    });
  }, 30_000);

  it.skip("can set the outgoing sale price of the contract", async () => {
    assert.ok(false);
  });
  it.skip("can burn the shares after contract is sold", async () => {
    assert.ok(false);
  });
});

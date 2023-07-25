import assert from "assert";
import { beforeEach, describe, it } from "mocha";

import { mintContract } from "../src/contract";
import { mintContractStock } from "../src/contract_stock";
import { mintContractOptions } from "./test-data";
import {
  ADMIN_ADDRESS,
  ADMIN_CAP_ID,
  ADMIN_PHRASE,
  PACKAGE_ID,
  SUI_NETWORK,
  USER1_ADDRESS,
  USER2_ADDRESS,
} from "./test-helpers";

describe("mintContractStock", () => {
  let contractId: string;
  beforeEach(async () => {
    contractId = await mintContract(mintContractOptions);
  });

  it("should issue new shares", async () => {
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 2,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
  });

  it("should not issue new shares, when asking for too much", async () => {
    await assert.rejects(
      mintContractStock({
        contractId,
        signerPhrase: ADMIN_PHRASE,
        receiverAddress: USER1_ADDRESS,
        shares: 501,
        packageId: PACKAGE_ID,
        adminCapId: ADMIN_CAP_ID,
        network: SUI_NETWORK,
      })
    );
  });

  it("should not issue new shares, when sold out", async () => {
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 150,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER2_ADDRESS,
      shares: 250,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 98,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await assert.rejects(
      mintContractStock({
        contractId,
        signerPhrase: ADMIN_PHRASE,
        receiverAddress: USER2_ADDRESS,
        shares: 3,
        packageId: PACKAGE_ID,
        adminCapId: ADMIN_CAP_ID,
        network: SUI_NETWORK,
      })
    );
  });

  it("can give shares to OAM and owner", async () => {
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: ADMIN_ADDRESS,
      shares: 150,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER1_ADDRESS,
      shares: 50,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
    await mintContractStock({
      contractId,
      signerPhrase: ADMIN_PHRASE,
      receiverAddress: USER2_ADDRESS,
      shares: 1,
      packageId: PACKAGE_ID,
      adminCapId: ADMIN_CAP_ID,
      network: SUI_NETWORK,
    });
  });

  it.skip("can set the outgoing sale price of the contract", async () => {
    assert.ok(false);
  });
  it.skip("can burn the shares after contract is sold", async () => {
    assert.ok(false);
  });
});

import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import assert from "assert";
import { beforeEach, describe, it } from "vitest";
import { SuiExecutor } from "../src/Executor";
import { mintContract } from "../src/mintContract";
import { mintContractStock } from "../src/mintContractStock";
import { splitContractStock } from "../src/splitContractStock";
import { ADMIN_CAP_ID, ADMIN_PHRASE, getClient, mintContractOptions, PACKAGE_ID, USER1_ADDRESS, USER1_PHRASE, } from "./test-helpers";
import { getObject } from "./test-helpers";
describe("splitContractStock", () => {
    let executor;
    const client = getClient();
    let contractId;
    beforeEach(async function () {
        executor = new SuiExecutor({
            suiClient: client,
            keypair: Ed25519Keypair.deriveKeypair(ADMIN_PHRASE),
            packageId: PACKAGE_ID,
        });
        const res = await mintContract(executor, mintContractOptions);
        contractId = res.contractId;
    }, 20_000);
    it("should split an contract stock", async () => {
        const { contractStockIds: [contractStockId], } = await mintContractStock(executor, [
            {
                adminCapId: ADMIN_CAP_ID,
                contractId,
                receiverAddress: USER1_ADDRESS,
                quantity: 10,
            },
        ]);
        const user1Executor = new SuiExecutor({
            suiClient: client,
            keypair: Ed25519Keypair.deriveKeypair(USER1_PHRASE),
            packageId: PACKAGE_ID,
        });
        const { splitContractStockId } = await splitContractStock(user1Executor, {
            contractStockId,
            quantity: 2,
        });
        // Get the stock and check that it has 2 shares
        const splitStock = await getObject(splitContractStockId);
        const oldStock = await getObject(contractStockId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert.strictEqual(splitStock.data.content.fields.shares, "2");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert.strictEqual(oldStock.data.content.fields.shares, "8");
    }, 30_000);
    it("should split a split stock", async () => {
        const { contractStockIds: [contractStockId], } = await mintContractStock(executor, [
            {
                adminCapId: ADMIN_CAP_ID,
                contractId,
                receiverAddress: USER1_ADDRESS,
                quantity: 12,
            },
        ]);
        const user1Executor = new SuiExecutor({
            suiClient: client,
            keypair: Ed25519Keypair.deriveKeypair(USER1_PHRASE),
            packageId: PACKAGE_ID,
        });
        const { splitContractStockId } = await splitContractStock(user1Executor, {
            contractStockId,
            quantity: 5,
        });
        const { splitContractStockId: splitAgainContractStockId } = await splitContractStock(user1Executor, {
            contractStockId: splitContractStockId,
            quantity: 3,
        });
        const oldStock = await getObject(contractStockId);
        const splitStock = await getObject(splitContractStockId);
        const splitAgainStock = await getObject(splitAgainContractStockId);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert.strictEqual(oldStock.data.content.fields.shares, "7");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert.strictEqual(splitStock.data.content.fields.shares, "2");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        assert.strictEqual(splitAgainStock.data.content.fields.shares, "3");
    }, 30_000);
});
//# sourceMappingURL=splitContractStock.test.js.map
import { beforeEach, describe, expect, it } from "vitest";

import { getWalletAmount } from "../src/getters.js";
import { mintAsset } from "../src/mintAsset.js";
import { mintShare } from "../src/mintShare.js";
import { splitTransferMerge } from "../src/splitTransferMerge.js";
import {
	ADMIN_CAP_ID,
	adminWallet,
	makeMintAssetOptions,
	makeWallet,
	PACKAGE_ID,
} from "./test-helpers.js";

describe("splitTransferMerge", () => {
	let assetId: string;
	beforeEach(async () => {
		const mintOptions = makeMintAssetOptions();
		const res = await mintAsset(adminWallet, mintOptions);
		assetId = res.assetId;
	}, 30_000);

	it("should transfer shares and make sure everything is merged", async () => {
		const fromWallet = await makeWallet();
		const toWallet = await makeWallet();

		// User 1 has bought shares in 3 batches. Total: 9
		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: fromWallet.address,
			amount: 1,
		});
		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: fromWallet.address,
			amount: 3,
		});
		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: fromWallet.address,
			amount: 5,
		});
		// User 2 has bought shares in 2 batches. Total: 16
		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: toWallet.address,
			amount: 7,
		});
		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: toWallet.address,
			amount: 9,
		});

		const { fromShareId, toShareId } = await splitTransferMerge({
			packageId: PACKAGE_ID,
			fromWallet,
			toWallet,
			assetId,
			amount: 2,
		});

		expect(await getWalletAmount(fromWallet, fromShareId)).toEqual(7);
		expect(await getWalletAmount(toWallet, toShareId)).toEqual(18);
	}, 60_000);

	it("should not split when share is already the size of the transfer amount", async () => {
		const fromWallet = await makeWallet();
		const toWallet = await makeWallet();

		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: fromWallet.address,
			amount: 3,
		});

		const { fromShareId, toShareId } = await splitTransferMerge({
			packageId: PACKAGE_ID,
			fromWallet,
			toWallet,
			assetId,
			amount: 3,
		});

		expect(fromShareId).toEqual(toShareId);
		expect(await getWalletAmount(toWallet, toShareId)).toEqual(3);
	}, 30_000);
});

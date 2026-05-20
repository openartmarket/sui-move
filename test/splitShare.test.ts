import { beforeEach, describe, expect, it } from "vitest";
import type { AssetId } from "../src/brands.js";
import { getWalletAmount } from "../src/getters.js";
import { mintAsset } from "../src/mintAsset.js";
import { mintShare } from "../src/mintShare.js";
import { splitShare } from "../src/splitShare.js";
import type { Wallet } from "../src/Wallet.js";
import {
	ADMIN_CAP_ID,
	adminWallet,
	makeMintAssetOptions,
	makeWallet,
} from "./test-helpers.js";

describe("splitShare", () => {
	let assetId: AssetId;
	let wallet: Wallet;

	beforeEach(async () => {
		const mintOptions = makeMintAssetOptions();
		const res = await mintAsset(adminWallet, mintOptions);
		assetId = res.assetId;

		wallet = await makeWallet();
	}, 30_000);

	it("should split a share", async () => {
		const { shareId } = await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: wallet.address,
			amount: 10,
		});

		const { splitShareId } = await splitShare(wallet, {
			shareId,
			amount: 2,
		});

		expect(await getWalletAmount(wallet, splitShareId)).toEqual(2);
		expect(await getWalletAmount(wallet, shareId)).toEqual(8);
	}, 30_000);

	it("should split a split share", async () => {
		const { shareId } = await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: wallet.address,
			amount: 12,
		});

		const { splitShareId } = await splitShare(wallet, {
			shareId,
			amount: 5,
		});
		const { splitShareId: splitAgainShareId } = await splitShare(wallet, {
			shareId: splitShareId,
			amount: 3,
		});

		expect(await getWalletAmount(wallet, shareId)).toEqual(7);
		expect(await getWalletAmount(wallet, splitShareId)).toEqual(2);
		expect(await getWalletAmount(wallet, splitAgainShareId)).toEqual(3);
	}, 30_000);
});

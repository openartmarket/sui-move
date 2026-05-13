import { beforeEach, describe, expect, it } from "vitest";
import type { AssetId } from "../src/brands.js";
import { getWalletAmount } from "../src/getters.js";
import { mergeShares } from "../src/mergeShares.js";
import { mintAsset } from "../src/mintAsset.js";
import { mintShare } from "../src/mintShare.js";
import type { Wallet } from "../src/Wallet.js";
import {
	ADMIN_CAP_ID,
	adminWallet,
	makeMintAssetOptions,
	makeWallet,
} from "./test-helpers.js";

describe("mergeShares", () => {
	let assetId: AssetId;
	let wallet: Wallet;
	beforeEach(async () => {
		const mintOptions = makeMintAssetOptions();
		const res = await mintAsset(adminWallet, mintOptions);
		assetId = res.assetId;

		wallet = await makeWallet();
	}, 30_000);

	it("should merge shares", async () => {
		const { shareId: toShareId } = await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: wallet.address,
			amount: 9,
		});

		const { shareId: fromShareId } = await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: wallet.address,
			amount: 11,
		});

		await mergeShares(wallet, [
			{
				toShareId,
				fromShareId,
			},
		]);

		expect(await getWalletAmount(wallet, toShareId)).toEqual(20);
		await expect(getWalletAmount(wallet, fromShareId)).rejects.toSatisfy(
			(err) => {
				expect(err.code).toEqual("deleted");
				return true;
			},
		);
	}, 30_000);
});

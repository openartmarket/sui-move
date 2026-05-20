import { beforeEach, describe, expect, it } from "vitest";
import type { AssetId } from "../src/brands.js";
import { getShares } from "../src/getShares.js";
import { mintAsset } from "../src/mintAsset.js";
import { mintShare } from "../src/mintShare.js";
import { transferShare } from "../src/transferShare.js";
import type { Wallet } from "../src/Wallet.js";
import {
	ADMIN_CAP_ID,
	adminWallet,
	makeMintAssetOptions,
	makeWallet,
	PACKAGE_ID,
} from "./test-helpers.js";

describe("transferShare", () => {
	let assetId: AssetId;
	let fromWallet: Wallet;
	let toWallet: Wallet;
	beforeEach(async () => {
		const mintOptions = makeMintAssetOptions();
		const res = await mintAsset(adminWallet, mintOptions);
		assetId = res.assetId;

		fromWallet = await makeWallet();
		toWallet = await makeWallet();
	}, 30_000);

	it("should transfer ownership", async () => {
		const { shareId } = await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: fromWallet.address,
			amount: 12,
		});

		await transferShare(fromWallet, {
			assetId,
			shareId,
			toAddress: toWallet.address,
		});

		const shares = await getShares({
			suiClient: fromWallet.suiClient,
			owner: toWallet.address,
			assetId,
			packageId: PACKAGE_ID,
		});
		expect(shares).toHaveLength(1);
		expect(shares[0].objectId).toEqual(shareId);
	}, 30_000);
});

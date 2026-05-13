import assert from "node:assert";

import { beforeEach, describe, expect, it } from "vitest";
import { getAvailableShares } from "../src/getters.js";
import { mintAsset } from "../src/mintAsset.js";
import { mintShare } from "../src/mintShare.js";
import type { Wallet } from "../src/Wallet.js";
import {
	ADMIN_CAP_ID,
	adminWallet,
	makeMintAssetOptions,
	makeWallet,
} from "./test-helpers.js";

describe("mintShare", () => {
	let assetId: string;

	let wallet1: Wallet;
	let wallet2: Wallet;

	beforeEach(async () => {
		const mintOptions = makeMintAssetOptions();
		const res = await mintAsset(adminWallet, mintOptions);
		assetId = res.assetId;

		wallet1 = await makeWallet();
		wallet2 = await makeWallet();
	}, 30_000);

	it("should not issue new shares, when asking for too much", async () => {
		await assert.rejects(
			mintShare(adminWallet, {
				adminCapId: ADMIN_CAP_ID,
				assetId,
				amount: 501,
				receiverAddress: wallet1.address,
			}),
		);
	}, 30_000);

	it("should issue remaining shares", async () => {
		const sharesLeftBefore = await getAvailableShares(
			adminWallet.suiClient,
			assetId,
		);
		expect(sharesLeftBefore).toEqual(500);

		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			amount: 498,
			receiverAddress: wallet1.address,
		});

		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			amount: 2,
			receiverAddress: wallet1.address,
		});

		const sharesLeftAfter = await getAvailableShares(
			adminWallet.suiClient,
			assetId,
		);
		expect(sharesLeftAfter).toEqual(0);

		await assert.rejects(
			mintShare(adminWallet, {
				adminCapId: ADMIN_CAP_ID,
				assetId,
				amount: 1,
				receiverAddress: wallet1.address,
			}),
		);
	}, 30_000);

	it("should not issue more shares than available", async () => {
		await assert.rejects(
			mintShare(adminWallet, {
				adminCapId: ADMIN_CAP_ID,
				assetId,
				receiverAddress: wallet2.address,
				amount: 501,
			}),
		);
	}, 30_000);

	it.skip("can set the outgoing sale price of the asset", async () => {
		assert.ok(false);
	});
	it.skip("can burn the shares after asset is sold", async () => {
		assert.ok(false);
	});
});

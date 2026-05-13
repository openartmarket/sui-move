import assert from "node:assert";
import { beforeEach, describe, it } from "vitest";
import { endMotion } from "../src/endMotion.js";
import { mintAsset } from "../src/mintAsset.js";
import { mintShare } from "../src/mintShare.js";
import { startMotion } from "../src/startMotion.js";
import { vote } from "../src/vote.js";
import type { Wallet } from "../src/Wallet.js";
import {
	ADMIN_ADDRESS,
	ADMIN_CAP_ID,
	adminWallet,
	makeMintAssetOptions,
	makeWallet,
} from "./test-helpers.js";

describe("governance", () => {
	let assetId: string;
	let user1: Wallet;
	let user2: Wallet;
	let user3: Wallet;

	beforeEach(async () => {
		const mintOptions = makeMintAssetOptions();
		const res = await mintAsset(adminWallet, mintOptions);
		assetId = res.assetId;

		user1 = await makeWallet();
		user2 = await makeWallet();
		user3 = await makeWallet();

		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: ADMIN_ADDRESS,
			amount: 151,
		});
		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: user1.address,
			amount: 249,
		});
		await mintShare(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			receiverAddress: user2.address,
			amount: 100,
		});
	}, 30_000);

	it("can start a motion", async () => {
		const motion = await startMotion(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			motion: "Sell asset to a buyer",
		});
		assert.ok(motion);
	}, 30_000);

	it("can vote as a shareholder", async () => {
		const { motionId } = await startMotion(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			motion: "Sell asset to a buyer",
		});

		await vote(user1, {
			assetId,
			motionId,
			choice: true,
		});
	}, 30_000);

	it("cannot double vote as a shareholder", async () => {
		const { motionId } = await startMotion(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			motion: "Sell asset to a buyer",
		});

		await vote(user1, {
			assetId,
			motionId,
			choice: true,
		});
		await assert.rejects(
			vote(user1, {
				assetId,
				motionId,
				choice: true,
			}),
		);
	}, 30_000);

	it("cannot vote if not a shareholder", async () => {
		const { motionId } = await startMotion(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			motion: "Sell asset to a buyer",
		});

		await assert.rejects(
			vote(user3, {
				assetId,
				motionId,
				choice: true,
			}),
		);
	}, 30_000);

	it("cannot vote if motion is closed", async () => {
		const { motionId } = await startMotion(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			motion: "Sell asset to a buyer",
		});

		await endMotion(adminWallet, {
			adminCapId: ADMIN_CAP_ID,
			motionId,
		});

		await assert.rejects(
			vote(user1, {
				assetId,
				motionId,
				choice: true,
			}),
		);
	}, 30_000);
});

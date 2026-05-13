import { beforeEach, describe, expect, it } from "vitest";
import { mintAsset } from "../src/mintAsset.js";
import {
	findShare,
	type MintShareParams,
	mintShare,
} from "../src/mintShare.js";
import type { Wallet } from "../src/Wallet.js";
import {
	ADMIN_CAP_ID,
	adminWallet,
	makeMintAssetOptions,
	makeWallet,
} from "./test-helpers.js";

describe("mintShare", () => {
	let assetId: string;
	let wallet: Wallet;

	beforeEach(async () => {
		const mintOptions = makeMintAssetOptions();
		const res = await mintAsset(adminWallet, mintOptions);
		assetId = res.assetId;

		wallet = await makeWallet();
	}, 30_000);

	it("should find a previously minted share", async () => {
		const mintShareParams: MintShareParams = {
			adminCapId: ADMIN_CAP_ID,
			assetId,
			amount: 100,
			receiverAddress: wallet.address,
		};

		const share1 = await mintShare(adminWallet, mintShareParams);
		const share2 = await findShare(adminWallet, mintShareParams);
		expect(share2).toEqual(share1);
	});
});

import { describe, expect, it } from "vitest";
import { findAsset, mintAsset } from "../src";
import { adminWallet, makeMintAssetOptions } from "./test-helpers.js";

describe("findAsset", () => {
	it("should find a previously minted asset", {
		timeout: 100_000,
	}, async () => {
		const mintOptions = makeMintAssetOptions();
		// findAsset only matches the mint_asset PTB inputs, so omit metadata
		// (which is applied in a follow-up PTB).
		const { metadata: _metadata, ...findOptions } = mintOptions;

		const asset1 = await mintAsset(adminWallet, mintOptions);
		const asset2 = await findAsset(adminWallet, {
			...findOptions,
			metadata: {},
		});
		expect(asset2).toEqual(asset1);
	});
});

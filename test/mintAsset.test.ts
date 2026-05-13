import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { mintAsset } from "../src/mintAsset.js";
import {
	ADMIN_CAP_ID,
	adminWallet,
	makeMintAssetOptions,
} from "./test-helpers.js";

describe("mintAsset", () => {
	it("mints a wine asset with class-specific metadata via dynamic fields", {
		timeout: 60_000,
	}, async () => {
		// Prove "open for extension": the contract has no `vintage`, `region`
		// or `abv` field, yet we can attach them as metadata to a wine asset
		// without any Move changes.
		const metadata = {
			vintage: "2010",
			region: "Bordeaux",
			abv: "13.5",
		};
		const { assetId } = await mintAsset(
			adminWallet,
			makeMintAssetOptions({
				adminCapId: ADMIN_CAP_ID,
				kind: "wine",
				name: "Château Margaux 2010",
				description: "First-growth Bordeaux",
				reference: `wine-${randomUUID()}`,
				metadata,
			}),
		);

		const response = await adminWallet.suiClient.getObject({
			id: assetId,
			options: { showContent: true },
		});
		const content = response.data?.content;
		if (!content || content.dataType !== "moveObject") {
			throw new Error(`No content for ${assetId}`);
		}
		const fields = content.fields as Record<string, unknown>;
		expect(fields.kind).toEqual("wine");
		expect(fields.name).toEqual("Château Margaux 2010");

		// The dynamic fields hold the class-specific metadata.
		const dynamicFields = await adminWallet.suiClient.getDynamicFields({
			parentId: assetId,
		});
		const metadataKeys = dynamicFields.data
			.filter((df) => String(df.name.type).includes("::asset::MetaKey"))
			.map((df) => {
				const value = df.name.value as { key: string };
				return value.key;
			});
		expect(metadataKeys.sort()).toEqual(["abv", "region", "vintage"]);
	});
});

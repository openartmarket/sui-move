import type { Address, Digest, PublisherId } from "./brands.js";
import { toDigest } from "./brands.js";
import type { Wallet } from "./Wallet.js";

export type CreateDisplayParams = {
	publisherId: PublisherId;
	fields: Record<string, string>;
	type: "Asset" | "Share";
	address: Address;
};

export type CreateDisplayResult = {
	digest: Digest;
};

/**
 * Build a default set of Sui Object Display field templates for an Asset.
 *
 * The returned fields are the seven standard keys recognized by wallets and
 * explorers; each value (except `project_url`) is a `{field}` template that
 * substitutes the corresponding String field on the Asset struct at display
 * time.
 *
 * @param projectUrl Full URL to the consuming application's homepage. This
 *   is rendered verbatim as the static `project_url` Display field — the
 *   per-asset detail page belongs in the `link` field (which substitutes
 *   from the Asset's `link` field).
 *
 * @see https://docs.sui.io/standards/display
 */
export function defaultDisplayFields(
	projectUrl: string,
): Record<string, string> {
	return {
		name: "{name}",
		description: "{description}",
		link: "{link}",
		image_url: "{image_url}",
		thumbnail_url: "{thumbnail_url}",
		project_url: projectUrl,
		creator: "{creator}",
	};
}

export async function createDisplay(
	wallet: Wallet,
	params: CreateDisplayParams,
): Promise<CreateDisplayResult> {
	const { publisherId, fields, type, address } = params;

	const response = await wallet.execute(async (txb, packageId) => {
		const typeArgument = `${packageId}::asset::${type}`;

		const keys = Object.keys(fields);
		const values = Object.values(fields);

		const display = txb.moveCall({
			target: "0x2::display::new_with_fields",
			arguments: [
				txb.object(publisherId),
				txb.pure.vector("string", keys),
				txb.pure.vector("string", values),
			],
			typeArguments: [typeArgument],
		});

		txb.moveCall({
			target: "0x2::display::update_version",
			arguments: [display],
			typeArguments: [typeArgument],
		});

		txb.transferObjects([display], txb.pure.address(address));
	});

	return { digest: toDigest(response.digest) };
}

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
 * Build a default set of Display field templates for an Asset or Share.
 * Pass a merchant-specific baseUrl (e.g. "https://coownable.example.com")
 * and override individual entries as needed.
 */
export function defaultDisplayFields(baseUrl: string): Record<string, string> {
	return {
		name: "{name}",
		description: "{description}",
		currency: "{currency}",
		kind: "{kind}",
		image_url: `${baseUrl}/image/{reference}`,
		project_url: `${baseUrl}/perma/{reference}`,
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

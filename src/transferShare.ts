import type { Address, AssetId, Digest, ShareId } from "./brands.js";
import { toDigest } from "./brands.js";
import type { Wallet } from "./Wallet.js";

export type TransferShareParams = {
	assetId: AssetId;
	shareId: ShareId;
	toAddress: Address;
};

export type TransferShareResult = {
	digest: Digest;
};

export async function transferShare(
	wallet: Wallet,
	params: TransferShareParams,
): Promise<TransferShareResult> {
	const response = await wallet.execute(async (txb, packageId) => {
		const { assetId, shareId, toAddress } = params;
		txb.moveCall({
			target: `${packageId}::asset::transfer_share`,
			arguments: [
				txb.object(assetId),
				txb.object(shareId),
				txb.pure.address(toAddress),
			],
		});
	});
	return { digest: toDigest(response.digest) };
}

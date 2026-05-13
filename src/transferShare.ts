import type { Wallet } from "./Wallet.js";

export type TransferShareParams = {
	assetId: string;
	shareId: string;
	toAddress: string;
};

export type TransferShareResult = {
	digest: string;
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
	const { digest } = response;
	return { digest };
}

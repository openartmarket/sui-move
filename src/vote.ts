import type { Wallet } from "./Wallet.js";

export type VoteParams = {
	assetId: string;
	motionId: string;
	choice: boolean;
};

export type VoteResult = {
	digest: string;
};

export async function vote(
	wallet: Wallet,
	params: VoteParams,
): Promise<VoteResult> {
	const { assetId, motionId, choice } = params;
	const response = await wallet.execute(async (txb, packageId) => {
		txb.moveCall({
			target: `${packageId}::governance::cast_vote`,
			arguments: [
				txb.object(assetId),
				txb.object(motionId),
				txb.pure.bool(choice),
			],
		});
	});
	const { digest } = response;
	return { digest };
}

import type { SuiObjectData } from "@mysten/sui/jsonRpc";
import { getShares } from "./getShares.js";
import { getWalletAmount } from "./getters.js";
import type { MergeSharesParam } from "./mergeShares.js";
import { mergeShares } from "./mergeShares.js";
import { splitShare } from "./splitShare.js";
import { transferShare } from "./transferShare.js";
import type { Wallet } from "./Wallet.js";

export type SplitMergeTransferParams = {
	packageId: string;
	fromWallet: Wallet;
	toWallet: Wallet;
	assetId: string;
	amount: number;
};

export type SplitMergeTransferResult = {
	digest: string;
	fromShareId: string;
	toShareId: string;
};

/**
 * Transfers an amount of shares from one address to another.
 * Takes care of splitting and merging so that after the transfer,
 * both addresses have a single Share.
 */
export async function splitTransferMerge({
	packageId,
	fromWallet,
	toWallet,
	assetId,
	amount,
}: SplitMergeTransferParams): Promise<SplitMergeTransferResult> {
	const fromShares = await getShares({
		suiClient: fromWallet.suiClient,
		owner: fromWallet.address,
		assetId,
		packageId,
	});
	for (const { fromShareId, toShareId } of makeMergeShareParams(fromShares)) {
		await mergeShares(fromWallet, [{ fromShareId, toShareId }]);
	}

	const fromSharesAfterMerge = await getShares({
		suiClient: fromWallet.suiClient,
		owner: fromWallet.address,
		assetId,
		packageId,
	});
	if (fromSharesAfterMerge.length !== 1) {
		throw new Error(
			`Expected a single share after merge, but got ${JSON.stringify(
				fromSharesAfterMerge,
				null,
				2,
			)}`,
		);
	}

	const currentAmount = await getWalletAmount(
		fromWallet,
		fromSharesAfterMerge[0].objectId,
	);
	if (currentAmount < amount) {
		throw new Error(
			`Cannot transfer ${amount} shares, because there are only ${currentAmount} shares`,
		);
	}
	let shareId: string;
	if (currentAmount > amount) {
		const { splitShareId } = await splitShare(fromWallet, {
			shareId: fromSharesAfterMerge[0].objectId,
			amount,
		});
		shareId = splitShareId;
	} else {
		shareId = fromShares[0].objectId;
	}

	const { digest } = await transferShare(fromWallet, {
		assetId,
		shareId,
		toAddress: toWallet.address,
	});

	const toShares = await getShares({
		suiClient: toWallet.suiClient,
		owner: toWallet.address,
		assetId,
		packageId,
	});
	for (const { fromShareId, toShareId } of makeMergeShareParams(toShares)) {
		await mergeShares(toWallet, [{ fromShareId, toShareId }]);
	}
	return {
		digest,
		fromShareId: fromShares[0].objectId,
		toShareId: toShares[0].objectId,
	};
}

function makeMergeShareParams(
	shares: readonly SuiObjectData[],
): readonly MergeSharesParam[] {
	const sharesToMerge = shares.slice(1);
	return sharesToMerge.map((share) => ({
		fromShareId: share.objectId,
		toShareId: shares[0].objectId,
	}));
}

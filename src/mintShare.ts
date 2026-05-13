import type { SuiTransactionBlockResponse } from "@mysten/sui/jsonRpc";
import { findTransaction } from "./findTransaction.js";
import { getAddressOwner, getCreatedObjects } from "./getters.js";
import type { Wallet } from "./Wallet.js";

export type MintShareParams = {
	adminCapId: string;
	assetId: string;
	receiverAddress: string;
	amount: number;
};

export type MintShareResult = {
	shareId: string;
	digest: string;
};

/**
 * Mint a new share of an asset and transfer it to receiverAddress.
 *
 * This function is idempotent. If a share with the same parameters already
 * exists on the chain, it will be returned.
 */
export async function mintShare(
	wallet: Wallet,
	params: MintShareParams,
): Promise<MintShareResult> {
	const { adminCapId, assetId, amount, receiverAddress } = params;

	const response = await wallet.execute(async (txb, packageId) => {
		txb.moveCall({
			target: `${packageId}::asset::mint_share`,
			arguments: [
				txb.object(adminCapId),
				txb.object(assetId),
				txb.pure.u64(amount),
				txb.pure.address(receiverAddress),
			],
		});
	});

	return toMintShareResult(response);
}

export async function findShare(
	wallet: Wallet,
	params: MintShareParams,
): Promise<MintShareResult | null> {
	const response = await findTransaction(
		wallet.suiClient,
		{
			filter: {
				MoveFunction: {
					function: "mint_share",
					module: "asset",
					package: wallet.packageId,
				},
			},
			options: {
				showInput: true,
				showObjectChanges: true,
			},
		},
		(res: SuiTransactionBlockResponse) => {
			const { adminCapId, assetId, amount, receiverAddress } = params;
			const expected = [adminCapId, assetId, amount, receiverAddress].map(
				(value) => value.toString(),
			);
			if (
				res.transaction?.data?.transaction?.kind !== "ProgrammableTransaction"
			) {
				return false;
			}
			const inputs = res.transaction.data.transaction.inputs;
			const inputValues = inputs.map((input) => {
				if (input.type === "pure") {
					return input.value;
				}
				if (input.type === "object") {
					return input.objectId;
				}
				return undefined;
			});
			return inputValues.every((value, index) => value === expected[index]);
		},
	);
	if (!response) {
		return null;
	}
	return toMintShareResult(response);
}

function toMintShareResult(
	response: SuiTransactionBlockResponse,
): MintShareResult {
	const { digest } = response;
	const objects = getCreatedObjects(response);
	const ownedObjects = objects.filter((obj) => getAddressOwner(obj) !== null);
	if (ownedObjects.length !== 1) {
		throw new Error(
			`Expected 1 owned objects, got ${JSON.stringify(ownedObjects, null, 2)}`,
		);
	}
	const shareId = ownedObjects[0].objectId;
	return { shareId, digest };
}

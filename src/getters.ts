import type {
	MoveStruct,
	SuiJsonRpcClient,
	SuiObjectChangeCreated,
	SuiObjectData,
	SuiObjectResponse,
	SuiParsedData,
	SuiTransactionBlockResponse,
} from "@mysten/sui/jsonRpc";

import type { Address, AssetId, ShareId } from "./brands.js";
import { toAddress } from "./brands.js";
import type { ReadonlyWallet } from "./Wallet.js";

export function getCreatedObjects(
	txRes: SuiTransactionBlockResponse,
): SuiObjectChangeCreated[] {
	return (txRes.objectChanges || []).filter(
		(change) => change.type === "created",
	) as SuiObjectChangeCreated[];
}

export function getObjectData(response: SuiObjectResponse): SuiObjectData {
	const { error, data } = response;
	if (error) {
		throw error;
	}
	if (!data) {
		throw new Error(`No data: ${JSON.stringify(response)}`);
	}
	return data;
}

export function getParsedData(data: SuiObjectData): SuiParsedData {
	const { content } = data;
	if (!content) {
		throw new Error(`No content: ${JSON.stringify(data)}`);
	}
	return content;
}

export function getType(data: SuiParsedData): string {
	return getMoveObject(data).type;
}

export function getStringField(data: SuiParsedData, key: string): string {
	const { fields } = getMoveObject(data);
	if (!fields) {
		throw new Error(`No txn.data.content.fields: ${JSON.stringify(data)}`);
	}

	function getStringField(struct: MoveStruct, key: string): string {
		if (Array.isArray(struct)) {
			throw new Error(
				`Unexpected response.data.content.fields as array: ${JSON.stringify(data)}`,
			);
		}
		if (!(key in struct)) {
			throw new Error(
				`No response.data.content.fields[${key}]: ${JSON.stringify(data)}`,
			);
		}
		const value = Reflect.get(struct, key);
		if (typeof value !== "string") {
			throw new Error(
				`Unexpected type for response.data.content.fields[${key}]: ${JSON.stringify(data)}`,
			);
		}
		return value;
	}

	return getStringField(fields, key);
}

/**
 * Get the `amount` field of a Share NFT.
 */
export async function getAmount(
	suiClient: SuiJsonRpcClient,
	shareId: ShareId,
): Promise<number> {
	const response = await suiClient.getObject({
		id: shareId,
		options: { showContent: true, showOwner: true },
	});
	const objectData = getObjectData(response);
	const parsedData = getParsedData(objectData);
	return getIntField(parsedData, "amount");
}

/**
 * Get the `available_shares` field of an Asset.
 */
export async function getAvailableShares(
	suiClient: SuiJsonRpcClient,
	assetId: AssetId,
): Promise<number> {
	const response = await suiClient.getObject({
		id: assetId,
		options: { showContent: true, showOwner: true },
	});
	const objectData = getObjectData(response);
	const parsedData = getParsedData(objectData);
	return getIntField(parsedData, "available_shares");
}

/**
 * Get the `amount` field of a Share NFT, asserting it is owned by `wallet`.
 */
export async function getWalletAmount(
	wallet: ReadonlyWallet,
	shareId: ShareId,
): Promise<number> {
	const { suiClient } = wallet;
	const response = await suiClient.getObject({
		id: shareId,
		options: { showContent: true, showOwner: true },
	});
	const objectData = getObjectData(response);
	const addressOwner = getAddressOwner(objectData);
	if (addressOwner !== wallet.address) {
		throw new Error(
			`Object ${objectData} is not owned by ${wallet.address} but by ${addressOwner}`,
		);
	}

	const parsedData = getParsedData(objectData);
	return getIntField(parsedData, "amount");
}

export function getAddressOwner(objectData: SuiObjectData): Address | null {
	const owner = objectData.owner;
	if (!owner) throw new Error(`Object ${objectData} has no owner`);
	if (typeof owner === "string") {
		throw new Error(`Object ${objectData} has a string owner ${owner}`);
	}
	if ("AddressOwner" in owner) {
		return toAddress(owner.AddressOwner);
	}
	return null;
}

function getMoveObject(data: SuiParsedData) {
	const { dataType } = data;
	if (dataType !== "moveObject") {
		throw new Error(
			`Unexpected txn.data.content.dataType: ${JSON.stringify(data)}`,
		);
	}
	return data;
}

export function getIntField(data: SuiParsedData, key: string): number {
	const value = getStringField(data, key);
	return toInt(value);
}

function toInt(s: string) {
	if (!s.match(/^[0-9]+$/)) {
		throw new Error(`${s} is not a valid integer`);
	}
	const number = Number.parseInt(s, 10);
	if (Number.isNaN(number) || !Number.isInteger(number)) {
		throw new Error(`${s} is not a valid integer`);
	}
	return number;
}

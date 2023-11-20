import type { SuiObjectChangeCreated, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
export declare function getSigner(phrase: string): {
    keypair: Ed25519Keypair;
    address: string;
};
export declare function handleTransactionResponse(txRes: SuiTransactionBlockResponse): void;
export declare function getCreatedObjects(txRes: SuiTransactionBlockResponse): SuiObjectChangeCreated[];

import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

import {
	ContractFields,
	ContractStockFields,
	createDisplay,
} from "../src/createDisplay.js";
import { adminWallet, getEnv } from "../test/test-helpers.js";

const PUBLISHER_ID = getEnv("PUBLISHER_ID");
const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");

async function main() {
	const keypair = Ed25519Keypair.deriveKeypair(ADMIN_PHRASE);
	const address = keypair.getPublicKey().toSuiAddress();

	await createDisplay(adminWallet, {
		publisherId: PUBLISHER_ID,
		address,
		fields: ContractFields,
		type: "Contract",
	});

	await createDisplay(adminWallet, {
		publisherId: PUBLISHER_ID,
		address,
		fields: ContractStockFields,
		type: "ContractStock",
	});

	console.log("✅ Displays created successfully!");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import {
	createDisplay,
	defaultDisplayFields,
} from "../src/createDisplay.js";
import { adminWallet, getEnv } from "../test/test-helpers.js";

const PUBLISHER_ID = getEnv("PUBLISHER_ID");
const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");
// Off-chain URL templates baked into Display objects. Merchant-specific; defaults
// to the public Coownable host so CI / localnet runs don't need to set anything.
const DISPLAY_BASE_URL = process.env.DISPLAY_BASE_URL ?? "https://coownable.com";

async function main() {
	const keypair = Ed25519Keypair.deriveKeypair(ADMIN_PHRASE);
	const address = keypair.getPublicKey().toSuiAddress();

	const fields = defaultDisplayFields(DISPLAY_BASE_URL);

	await createDisplay(adminWallet, {
		publisherId: PUBLISHER_ID,
		address,
		fields,
		type: "Asset",
	});

	await createDisplay(adminWallet, {
		publisherId: PUBLISHER_ID,
		address,
		fields: {
			...fields,
			thumbnail_url: `${DISPLAY_BASE_URL}/image/{reference}?thumb=1`,
		},
		type: "Share",
	});

	console.log("Displays created");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

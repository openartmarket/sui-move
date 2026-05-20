import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { toAddress, toPublisherId } from "../src/brands.js";
import {
	createDisplay,
	defaultDisplayFields,
} from "../src/createDisplay.js";
import { adminWallet, getEnv } from "../test/test-helpers.js";

const PUBLISHER_ID = toPublisherId(getEnv("PUBLISHER_ID"));
const ADMIN_PHRASE = getEnv("ADMIN_PHRASE");
// Project URL baked into the Display objects as the static `project_url`
// field. Merchant-specific; defaults to the public Coownable host so CI /
// localnet runs don't need to set anything.
const PROJECT_URL = process.env.PROJECT_URL ?? "https://coownable.com";

async function main() {
	const keypair = Ed25519Keypair.deriveKeypair(ADMIN_PHRASE);
	const address = toAddress(keypair.getPublicKey().toSuiAddress());

	const fields = defaultDisplayFields(PROJECT_URL);

	await createDisplay(adminWallet, {
		publisherId: PUBLISHER_ID,
		address,
		fields,
		type: "Asset",
	});

	// Share Display: the Share struct only carries id / asset_id / amount /
	// share_price, so most `{field}` templates resolve to empty. We expose
	// just the minimal surface here; richer Share rendering would require
	// embedding asset metadata onto Share at mint time.
	await createDisplay(adminWallet, {
		publisherId: PUBLISHER_ID,
		address,
		fields: {
			project_url: PROJECT_URL,
		},
		type: "Share",
	});

	console.log("Displays created");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

import { exec } from "node:child_process";
async function getSuiCoinObjectId() {
    const gas = await execSui("sui client gas --json");
    return gas[0].id.id;
}
/**
 * Creates a new address and transfers balance to it.
 */
export async function newSuiAddress(balance = 20_000_000_000) {
    const [address, phrase] = await execSui("sui client new-address ed25519 --json");
    const suiCoinObjectId = await getSuiCoinObjectId();
    await transferSui({ to: address, suiCoinObjectId, amount: balance });
    return { address, phrase };
}
async function transferSui({ to, suiCoinObjectId, amount, gasBudget = 200_000_000, }) {
    await execSui(`sui client transfer-sui --amount ${amount} --to "${to}" --gas-budget ${gasBudget} --sui-coin-object-id "${suiCoinObjectId}" --json`);
}
async function execSui(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err)
                return reject(err);
            if (stderr)
                return reject(new Error(stderr));
            try {
                resolve(JSON.parse(stdout));
            }
            catch (err) {
                reject(`Didn't get JSON output from sui: ${stdout}`);
            }
        });
    });
}
//# sourceMappingURL=sui.js.map
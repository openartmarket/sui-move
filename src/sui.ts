import { exec } from "node:child_process";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

async function getSuiCoinObjectId(): Promise<string> {
  const gas = await execSui<{ id: { id: string } }[]>("sui client gas --json");
  return gas[0].id.id;
}

export type SuiAddress = {
  readonly address: string;
  readonly phrase: string;
};

/**
 * Creates a new address and transfers balance to it.
 */
export async function newSuiAddress(balance = 20_000_000_000): Promise<SuiAddress> {
  const [address, phrase] = await execSui<[string, string, string]>(
    "sui client new-address ed25519 --json",
  );
  const suiCoinObjectId = await getSuiCoinObjectId();
  await transferSui({ to: address, suiCoinObjectId, amount: balance });
  return { address, phrase };
}

type TransferSuiParams = {
  to: string;
  suiCoinObjectId: string;
  amount: number;
  gasBudget?: number;
};

async function transferSui({
  to,
  suiCoinObjectId,
  amount,
  gasBudget = 200_000_000,
}: TransferSuiParams) {
  await execSui(
    `sui client transfer-sui --amount ${amount} --to "${to}" --gas-budget ${gasBudget} --sui-coin-object-id "${suiCoinObjectId}" --json`,
  );
}

async function execSui<T extends Json>(command: string): Promise<T> {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);
      if (stderr) return reject(new Error(stderr));
      try {
        resolve(JSON.parse(stdout) as T);
      } catch {
        reject(`Didn't get JSON output from sui: ${stdout}`);
      }
    });
  });
}

import type { Wallet } from "./Wallet.js";

export type CreateDisplayParams = {
  publisherId: string;
  fields: Record<string, string>;
  type: "Contract" | "ContractStock";
  address: string;
};

export type CreateDisplayResult = {
  digest: string;
};

export const ContractFields = {
  name: "{name}",
  artist: "{artist}",
  description: "{description}",
  currency: "{currency}",
  image_url: "https://openartmarket.com/image/{reference}",
  project_url: "https://openartmarket.com/perma/{reference}",
};

export const ContractStockFields = {
  name: "{name}",
  artist: "{artist}",
  description: "{description}",
  currency: "{currency}",
  image_url: "https://openartmarket.com/image/{reference}",
  thumbnail_url: "https://openartmarket.com/image/{reference}?thumb=1",
  project_url: "https://openartmarket.com/perma/{reference}",
};

export async function createDisplay(
  wallet: Wallet,
  params: CreateDisplayParams,
): Promise<CreateDisplayResult> {
  const { publisherId, fields, type, address } = params;

  const response = await wallet.execute(async (txb, packageId) => {
    const typeArgument = `${packageId}::open_art_market::${type}`;

    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const contractDisplay = txb.moveCall({
      target: "0x2::display::new_with_fields",
      arguments: [
        txb.object(publisherId),
        txb.pure.vector("string", keys),
        txb.pure.vector("string", values),
      ],
      typeArguments: [typeArgument],
    });

    txb.moveCall({
      target: "0x2::display::update_version",
      arguments: [contractDisplay],
      typeArguments: [typeArgument],
    });

    txb.transferObjects([contractDisplay], txb.pure.address(address));
  });

  const { digest } = response;
  return { digest };
}

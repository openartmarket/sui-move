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
export async function createDisplay(executor, params) {
    const { publisherId, fields, type, address } = params;
    const response = await executor.execute((txb, packageId) => {
        const typeArgument = `${packageId}::open_art_market::${type}`;
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        const contractDisplay = txb.moveCall({
            target: "0x2::display::new_with_fields",
            arguments: [
                txb.object(publisherId),
                txb.pure(keys),
                txb.pure(values),
            ],
            typeArguments: [typeArgument],
        });
        txb.moveCall({
            target: "0x2::display::update_version",
            arguments: [contractDisplay],
            typeArguments: [typeArgument],
        });
        txb.transferObjects([contractDisplay], txb.pure(address));
    });
    const { digest } = response;
    return { digest };
}
//# sourceMappingURL=createDisplay.js.map
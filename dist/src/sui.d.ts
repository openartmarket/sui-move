export type SuiAddress = {
    readonly address: string;
    readonly phrase: string;
};
/**
 * Creates a new address and transfers balance to it.
 */
export declare function newSuiAddress(balance?: number): Promise<SuiAddress>;

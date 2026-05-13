// Nominal (branded) types for strings that share a runtime shape but mean
// different things at the type level. Mixing them up (e.g. passing a
// PublisherId where a ShareId is expected) is a bug; the brand makes the
// compiler flag it.
//
// All Sui object identifiers and addresses are 0x-prefixed lowercase hex
// strings. Transaction digests are base58. Mnemonic phrases and asset
// kinds are free-form.

declare const __brand: unique symbol;
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

// Sui object IDs — distinguished by what they point to.
export type AssetId = Brand<string, "AssetId">;
export type ShareId = Brand<string, "ShareId">;
export type MotionId = Brand<string, "MotionId">;
export type AdminCapId = Brand<string, "AdminCapId">;
export type PublisherId = Brand<string, "PublisherId">;
export type UpgradeCapId = Brand<string, "UpgradeCapId">;
export type PackageId = Brand<string, "PackageId">;

// Other Sui-shaped strings.
export type Address = Brand<string, "Address">;
export type Digest = Brand<string, "Digest">;

// Domain identifiers.
export type AssetKind = Brand<string, "AssetKind">;
export type Phrase = Brand<string, "Phrase">;

const SUI_HEX = /^0x[0-9a-fA-F]+$/;

function assertSuiHex(value: string, label: string): void {
	if (!SUI_HEX.test(value)) {
		throw new Error(`Not a valid Sui ${label}: ${value}`);
	}
}

function brandSuiHex<T extends string>(s: string, label: string): T {
	assertSuiHex(s, label);
	return s as T;
}

export const toAssetId = (s: string): AssetId => brandSuiHex(s, "AssetId");
export const toShareId = (s: string): ShareId => brandSuiHex(s, "ShareId");
export const toMotionId = (s: string): MotionId => brandSuiHex(s, "MotionId");
export const toAdminCapId = (s: string): AdminCapId =>
	brandSuiHex(s, "AdminCapId");
export const toPublisherId = (s: string): PublisherId =>
	brandSuiHex(s, "PublisherId");
export const toUpgradeCapId = (s: string): UpgradeCapId =>
	brandSuiHex(s, "UpgradeCapId");
export const toPackageId = (s: string): PackageId =>
	brandSuiHex(s, "PackageId");
export const toAddress = (s: string): Address => brandSuiHex(s, "Address");

// Digests are base58, not hex; no shape validation here.
export const toDigest = (s: string): Digest => s as Digest;

// Free-form domain strings.
export const toAssetKind = (s: string): AssetKind => s as AssetKind;
export const toPhrase = (s: string): Phrase => s as Phrase;

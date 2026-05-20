module coownable::asset {

    // std lib imports
    use std::string::{String};

    // Sui imports
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::package::{Self};
    use sui::dynamic_field::{Self as df};
    use sui::event;

    friend coownable::governance;

    // Error codes
    const EInsufficientShares: u64 = 0;
    const EIncompatibleShareTypes: u64 = 1;
    const EInvalidAsset: u64 = 2;
    const EITONotFinished: u64 = 3;
    const EInvalidSupply: u64 = 4;
    const EInvalidSharePrice: u64 = 5;
    const EInvalidOutgoingPrice: u64 = 6;
    const EInvalidAmount: u64 = 7;
    const EAssetFrozen: u64 = 8;

    // A fractional Share of an Asset, owned by a shareholder. The struct
    // is intentionally minimal: descriptive fields (name, kind, currency, …)
    // are resolved through `asset_id`, avoiding duplication and drift.
    struct Share has key {
        id: UID,
        asset_id: ID,
        amount: u64,
        // The share price at mint time; useful for historical accounting.
        // The Asset carries the current share price.
        share_price: u64,
    }

    // The Asset object — shared, fractionally owned via Share NFTs.
    // The on-chain shape is fixed; class-specific metadata lives in
    // dynamic fields keyed by MetaKey, so new asset classes need no
    // changes to this module.
    // Display-relevant fields (image_url, thumbnail_url, link, creator) follow
    // the Sui Object Display Standard so that wallets and explorers can render
    // assets consistently. See https://docs.sui.io/standards/display.
    struct Asset has key, store {
        id: UID,
        kind: String,
        total_supply: u64,
        available_shares: u64,
        share_price: u64,
        outgoing_price: u64,
        currency: String,
        name: String,
        description: String,
        // Full URL to the canonical image. Surfaced as the `image_url`
        // Display field.
        image_url: String,
        // Full URL to a smaller preview image. Surfaced as the
        // `thumbnail_url` Display field.
        thumbnail_url: String,
        // Full URL to the per-asset info / detail page in the consuming
        // application. Surfaced as the `link` Display field.
        link: String,
        // Human-readable creator / author name. Surfaced as the `creator`
        // Display field.
        creator: String,
        // Count of open governance Motions. While non-zero, mint / transfer /
        // burn of Shares is blocked so vote weights cannot be manipulated
        // after a motion has started.
        active_motion_count: u64,
    }

    // Admin capability guarding privileged operations
    struct AdminCap has key, store {
        id: UID
    }

    // One-time witness used to claim the Publisher (must match module name)
    struct ASSET has drop {}

    // Per-holder balance, attached to Asset.id as a dynamic field keyed by
    // the holder's address. Invariant: a Holding DF exists iff the address
    // owns a non-zero amount of shares in the Asset.
    struct Holding has store {
        value: u64
    }

    // Wrapper key for class-specific metadata dynamic fields. The wrapper
    // gives metadata its own keyspace, separate from the address-keyed
    // holdings on the same UID.
    struct MetaKey has copy, drop, store { key: String }

    // Events. Off-chain indexers subscribe to these instead of polling
    // object diffs.

    struct AssetMinted has copy, drop {
        asset_id: ID,
        kind: String,
        total_supply: u64,
        share_price: u64,
        outgoing_price: u64,
        currency: String,
        name: String,
        description: String,
        image_url: String,
        thumbnail_url: String,
        link: String,
        creator: String,
    }

    struct MetadataSet has copy, drop {
        asset_id: ID,
        key: String,
        value: String,
    }

    struct ShareMinted has copy, drop {
        share_id: ID,
        asset_id: ID,
        receiver: address,
        amount: u64,
    }

    struct ShareTransferred has copy, drop {
        share_id: ID,
        asset_id: ID,
        from: address,
        to: address,
        amount: u64,
    }

    struct ShareSplit has copy, drop {
        source_share_id: ID,
        new_share_id: ID,
        asset_id: ID,
        amount: u64,
    }

    struct SharesMerged has copy, drop {
        kept_share_id: ID,
        burned_share_id: ID,
        asset_id: ID,
        amount: u64,
    }

    struct ShareBurned has copy, drop {
        share_id: ID,
        asset_id: ID,
        burner: address,
        amount: u64,
    }

    struct OutgoingPriceUpdated has copy, drop {
        asset_id: ID,
        new_outgoing_price: u64,
    }

    struct SharePriceUpdated has copy, drop {
        asset_id: ID,
        new_share_price: u64,
    }

    struct NameUpdated has copy, drop {
        asset_id: ID,
        new_name: String,
    }

    struct DescriptionUpdated has copy, drop {
        asset_id: ID,
        new_description: String,
    }

    struct CurrencyUpdated has copy, drop {
        asset_id: ID,
        new_currency: String,
    }

    struct ImageUrlUpdated has copy, drop {
        asset_id: ID,
        new_image_url: String,
    }

    struct ThumbnailUrlUpdated has copy, drop {
        asset_id: ID,
        new_thumbnail_url: String,
    }

    struct LinkUpdated has copy, drop {
        asset_id: ID,
        new_link: String,
    }

    struct CreatorUpdated has copy, drop {
        asset_id: ID,
        new_creator: String,
    }

    // Called on package publish
    fun init(otw: ASSET, ctx: &mut TxContext) {
        package::claim_and_keep(otw, ctx);
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    // Mint a new Asset as a shared object. The image_url / thumbnail_url /
    // link / creator parameters are surfaced via the Sui Object Display
    // Standard. See https://docs.sui.io/standards/display.
    public fun mint_asset(
        _: &AdminCap,
        kind: String,
        total_supply: u64,
        share_price: u64,
        outgoing_price: u64,
        name: String,
        description: String,
        currency: String,
        image_url: String,
        thumbnail_url: String,
        link: String,
        creator: String,
        ctx: &mut TxContext
    ) {
        assert!(total_supply > 0, EInvalidSupply);
        assert!(share_price > 0, EInvalidSharePrice);
        assert!(outgoing_price > 0, EInvalidOutgoingPrice);

        let asset = Asset {
            id: object::new(ctx),
            kind,
            total_supply,
            available_shares: total_supply,
            share_price,
            outgoing_price,
            currency,
            name,
            description,
            image_url,
            thumbnail_url,
            link,
            creator,
            active_motion_count: 0,
        };
        event::emit(AssetMinted {
            asset_id: object::uid_to_inner(&asset.id),
            kind: asset.kind,
            total_supply: asset.total_supply,
            share_price: asset.share_price,
            outgoing_price: asset.outgoing_price,
            currency: asset.currency,
            name: asset.name,
            description: asset.description,
            image_url: asset.image_url,
            thumbnail_url: asset.thumbnail_url,
            link: asset.link,
            creator: asset.creator,
        });
        transfer::public_share_object<Asset>(asset);
    }

    // Set (or overwrite) a class-specific metadata key on an Asset. Open
    // for extension: any string key is allowed, so new asset classes can
    // record their fields ("vintage", "abv", "artist", "creation_date",
    // "grading", …) without touching this module.
    public fun set_metadata(_: &AdminCap, asset: &mut Asset, key: String, value: String) {
        let asset_id = object::uid_to_inner(&asset.id);
        let meta_key = MetaKey { key };
        if (df::exists(&asset.id, meta_key)) {
            let existing = df::borrow_mut<MetaKey, String>(&mut asset.id, meta_key);
            *existing = value;
        } else {
            df::add(&mut asset.id, meta_key, value);
        };
        event::emit(MetadataSet {
            asset_id,
            key: meta_key.key,
            value: *df::borrow<MetaKey, String>(&asset.id, meta_key),
        });
    }

    public fun has_metadata(asset: &Asset, key: String): bool {
        df::exists(&asset.id, MetaKey { key })
    }

    public fun get_metadata(asset: &Asset, key: String): &String {
        df::borrow<MetaKey, String>(&asset.id, MetaKey { key })
    }

    // Mint a new Share NFT against an Asset and transfer it to receiver
    public fun mint_share(
        _: &AdminCap,
        asset: &mut Asset,
        amount: u64,
        receiver: address,
        ctx: &mut TxContext
    ) {
        assert!(asset.active_motion_count == 0, EAssetFrozen);
        assert!(amount > 0, EInvalidAmount);
        let remaining = asset.available_shares;
        assert!(amount <= remaining, EInsufficientShares);
        asset.available_shares = remaining - amount;

        increment_holding(asset, receiver, amount);

        let share = Share {
            id: object::new(ctx),
            asset_id: object::uid_to_inner(&asset.id),
            amount,
            share_price: asset.share_price,
        };

        event::emit(ShareMinted {
            share_id: object::uid_to_inner(&share.id),
            asset_id: share.asset_id,
            receiver,
            amount,
        });

        transfer::transfer(share, receiver);
    }

    // Transfer a Share to a new owner, keeping per-holder DF balances current
    public fun transfer_share(
        asset: &mut Asset,
        share: Share,
        new_owner: address,
        ctx: &mut TxContext
    ) {
        assert!(asset.active_motion_count == 0, EAssetFrozen);
        let sender = tx_context::sender(ctx);
        let amount = share.amount;
        let share_id = object::uid_to_inner(&share.id);
        let asset_id = share.asset_id;

        increment_holding(asset, new_owner, amount);
        decrement_holding(asset, sender, amount);

        event::emit(ShareTransferred {
            share_id,
            asset_id,
            from: sender,
            to: new_owner,
            amount,
        });

        transfer::transfer(share, new_owner);
    }

    // Internal: burn a Share unconditionally, returning the amount it contained
    fun burn_share(share: Share): u64 {
        let Share { id, asset_id: _, amount, share_price: _ } = share;
        object::delete(id);
        amount
    }

    // Burn a Share after the ITO has finished, returning the amount. Also
    // decrements the burner's Holding so per-holder balances stay accurate.
    public fun safe_burn_share(asset: &mut Asset, share: Share, ctx: &mut TxContext): u64 {
        assert!(asset.active_motion_count == 0, EAssetFrozen);
        assert!(object::uid_to_inner(&asset.id) == share.asset_id, EInvalidAsset);
        assert!(asset.available_shares == 0, EITONotFinished);

        let sender = tx_context::sender(ctx);
        let share_id = object::uid_to_inner(&share.id);
        let asset_id = share.asset_id;
        let amount = burn_share(share);

        decrement_holding(asset, sender, amount);

        event::emit(ShareBurned {
            share_id,
            asset_id,
            burner: sender,
            amount,
        });
        amount
    }

    // Merge share2 into share1 (burns share2). Not gated by the freeze
    // flag: merging within a single holder's wallet cannot change voting
    // weight, since the holder's Holding stays the same.
    public fun merge_shares(share1: &mut Share, share2: Share) {
        assert!(share1.asset_id == share2.asset_id, EIncompatibleShareTypes);
        let kept_share_id = object::uid_to_inner(&share1.id);
        let burned_share_id = object::uid_to_inner(&share2.id);
        let asset_id = share1.asset_id;
        let amount2 = burn_share(share2);
        share1.amount = share1.amount + amount2;
        event::emit(SharesMerged {
            kept_share_id,
            burned_share_id,
            asset_id,
            amount: amount2,
        });
    }

    // Split off `amount` from `share` into a new Share returned to the
    // sender. Not gated by the freeze flag: splitting within a single
    // holder's wallet cannot change voting weight.
    public fun split_share(share: &mut Share, amount: u64, ctx: &mut TxContext) {
        assert!(amount > 0, EInvalidAmount);
        assert!(share.amount > amount, EInsufficientShares);

        let new_share = Share {
            id: object::new(ctx),
            asset_id: share.asset_id,
            amount,
            share_price: share.share_price,
        };
        share.amount = share.amount - amount;
        event::emit(ShareSplit {
            source_share_id: object::uid_to_inner(&share.id),
            new_share_id: object::uid_to_inner(&new_share.id),
            asset_id: new_share.asset_id,
            amount,
        });
        transfer::transfer(new_share, tx_context::sender(ctx));
    }

    // Admin setters for the mutable fields of an Asset. `kind` and
    // `total_supply` remain immutable — changing them would break the
    // semantic identity of the asset.

    public fun update_outgoing_price(_: &AdminCap, asset: &mut Asset, new_outgoing_price: u64) {
        assert!(new_outgoing_price > 0, EInvalidOutgoingPrice);
        asset.outgoing_price = new_outgoing_price;
        event::emit(OutgoingPriceUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_outgoing_price,
        });
    }

    public fun update_share_price(_: &AdminCap, asset: &mut Asset, new_share_price: u64) {
        assert!(new_share_price > 0, EInvalidSharePrice);
        asset.share_price = new_share_price;
        event::emit(SharePriceUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_share_price,
        });
    }

    public fun update_name(_: &AdminCap, asset: &mut Asset, new_name: String) {
        asset.name = new_name;
        event::emit(NameUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_name: asset.name,
        });
    }

    public fun update_description(_: &AdminCap, asset: &mut Asset, new_description: String) {
        asset.description = new_description;
        event::emit(DescriptionUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_description: asset.description,
        });
    }

    public fun update_currency(_: &AdminCap, asset: &mut Asset, new_currency: String) {
        asset.currency = new_currency;
        event::emit(CurrencyUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_currency: asset.currency,
        });
    }

    public fun update_image_url(_: &AdminCap, asset: &mut Asset, new_image_url: String) {
        asset.image_url = new_image_url;
        event::emit(ImageUrlUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_image_url: asset.image_url,
        });
    }

    public fun update_thumbnail_url(_: &AdminCap, asset: &mut Asset, new_thumbnail_url: String) {
        asset.thumbnail_url = new_thumbnail_url;
        event::emit(ThumbnailUrlUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_thumbnail_url: asset.thumbnail_url,
        });
    }

    public fun update_link(_: &AdminCap, asset: &mut Asset, new_link: String) {
        asset.link = new_link;
        event::emit(LinkUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_link: asset.link,
        });
    }

    public fun update_creator(_: &AdminCap, asset: &mut Asset, new_creator: String) {
        asset.creator = new_creator;
        event::emit(CreatorUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_creator: asset.creator,
        });
    }

    // Friend hooks for the governance module to freeze share movement
    // while a Motion is active. Only `coownable::governance` may call.

    public(friend) fun bump_active_motion(asset: &mut Asset) {
        asset.active_motion_count = asset.active_motion_count + 1;
    }

    public(friend) fun release_active_motion(asset: &mut Asset) {
        asset.active_motion_count = asset.active_motion_count - 1;
    }

    // Internal Holding helpers. Maintain the invariant that a Holding DF
    // exists iff the address owns a non-zero amount of shares.
    fun increment_holding(asset: &mut Asset, owner: address, amount: u64) {
        if (df::exists(&asset.id, owner)) {
            let holding = df::borrow_mut<address, Holding>(&mut asset.id, owner);
            holding.value = holding.value + amount;
        } else {
            df::add(&mut asset.id, owner, Holding { value: amount });
        }
    }

    fun decrement_holding(asset: &mut Asset, owner: address, amount: u64) {
        let holding = df::borrow_mut<address, Holding>(&mut asset.id, owner);
        holding.value = holding.value - amount;
        if (holding.value == 0) {
            let Holding { value: _ } = df::remove<address, Holding>(&mut asset.id, owner);
        };
    }

    // Accessors

    public fun get_share_asset_id(share: &Share): ID {
        share.asset_id
    }

    public fun get_share_amount(share: &Share): u64 {
        share.amount
    }

    // Borrow the Asset's UID so other modules (e.g. governance) can read
    // per-holder dynamic fields without becoming friends.
    public fun get_asset_uid(asset: &Asset): &UID {
        &asset.id
    }

    public fun get_holding_value(holding: &Holding): u64 {
        holding.value
    }

    public fun get_available_shares(asset: &Asset): u64 {
        asset.available_shares
    }

    public fun get_active_motion_count(asset: &Asset): u64 {
        asset.active_motion_count
    }
}

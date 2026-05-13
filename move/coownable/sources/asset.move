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

    // Error codes
    const EInsufficientShares: u64 = 0;
    const EIncompatibleShareTypes: u64 = 1;
    const EInvalidAsset: u64 = 2;
    const EITONotFinished: u64 = 3;
    const EInvalidSupply: u64 = 4;
    const EInvalidSharePrice: u64 = 5;
    const EInvalidOutgoingPrice: u64 = 6;
    const EInvalidAmount: u64 = 7;

    // A fractional Share of an Asset, owned by a shareholder
    struct Share has key {
        id: UID,
        asset_id: ID,
        kind: String,
        amount: u64,
        share_price: u64,
        name: String,
        description: String,
        currency: String,
        reference: String,
    }

    // The Asset object — shared, fractionally owned via Share NFTs.
    // The on-chain shape is fixed; class-specific metadata lives in
    // dynamic fields keyed by MetaKey, so new asset classes need no
    // changes to this module.
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
        reference: String,
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
        reference: String,
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

    // Called on package publish
    fun init(otw: ASSET, ctx: &mut TxContext) {
        package::claim_and_keep(otw, ctx);
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    // Mint a new Asset as a shared object
    public fun mint_asset(
        _: &AdminCap,
        kind: String,
        total_supply: u64,
        share_price: u64,
        outgoing_price: u64,
        name: String,
        description: String,
        currency: String,
        reference: String,
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
            reference,
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
            reference: asset.reference,
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
        assert!(amount > 0, EInvalidAmount);
        let remaining = asset.available_shares;
        assert!(amount <= remaining, EInsufficientShares);
        asset.available_shares = remaining - amount;

        increment_holding(asset, receiver, amount);

        let share = Share {
            id: object::new(ctx),
            asset_id: object::uid_to_inner(&asset.id),
            kind: asset.kind,
            amount,
            share_price: asset.share_price,
            name: asset.name,
            description: asset.description,
            currency: asset.currency,
            reference: asset.reference,
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
        let Share {
            id,
            asset_id: _,
            kind: _,
            amount,
            share_price: _,
            name: _,
            description: _,
            currency: _,
            reference: _,
        } = share;
        object::delete(id);
        amount
    }

    // Burn a Share after the ITO has finished, returning the amount. Also
    // decrements the burner's Holding so per-holder balances stay accurate
    // (the original implementation didn't, leaving phantom voting weight).
    public fun safe_burn_share(asset: &mut Asset, share: Share, ctx: &mut TxContext): u64 {
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

    // Merge share2 into share1 (burns share2)
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

    // Split off `amount` from `share` into a new Share returned to the sender
    public fun split_share(share: &mut Share, amount: u64, ctx: &mut TxContext) {
        assert!(amount > 0, EInvalidAmount);
        assert!(share.amount > amount, EInsufficientShares);

        let new_share = Share {
            id: object::new(ctx),
            asset_id: share.asset_id,
            kind: share.kind,
            amount,
            share_price: share.share_price,
            name: share.name,
            description: share.description,
            currency: share.currency,
            reference: share.reference,
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

    // Update the outgoing (exit) price of an Asset
    public fun update_outgoing_price(_: &AdminCap, asset: &mut Asset, new_outgoing_price: u64) {
        asset.outgoing_price = new_outgoing_price;
        event::emit(OutgoingPriceUpdated {
            asset_id: object::uid_to_inner(&asset.id),
            new_outgoing_price,
        });
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
}

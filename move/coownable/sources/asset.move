module coownable::asset {

    // std lib imports
    use std::string::{String};

    // Sui imports
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::package::{Self};
    use sui::dynamic_field::{Self as df};

    // Error codes
    const EInsufficientShares: u64 = 0;
    const EIncompatibleShareTypes: u64 = 1;
    const EInvalidAsset: u64 = 2;
    const EITONotFinished: u64 = 3;
    const EInvalidSupply: u64 = 4;
    const EInvalidSharePrice: u64 = 5;
    const EInvalidOutgoingPrice: u64 = 6;

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
    // the holder's address.
    struct Holding has store {
        value: u64
    }

    // Wrapper key for class-specific metadata dynamic fields. The wrapper
    // gives metadata its own keyspace, separate from the address-keyed
    // holdings on the same UID.
    struct MetaKey has copy, drop, store { key: String }

    // Called on package publish
    fun init(otw: ASSET, ctx: &mut TxContext) {
        package::claim_and_keep(otw, ctx);
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    // Mint a new Asset as a shared object
    public fun mint_asset(
        _: &mut AdminCap,
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
        transfer::public_share_object<Asset>(asset);
    }

    // Set (or overwrite) a class-specific metadata key on an Asset. Open
    // for extension: any string key is allowed, so new asset classes can
    // record their fields ("vintage", "abv", "artist", "creation_date",
    // "grading", …) without touching this module.
    public fun set_metadata(_: &AdminCap, asset: &mut Asset, key: String, value: String) {
        let meta_key = MetaKey { key };
        if (df::exists(&asset.id, meta_key)) {
            let existing = df::borrow_mut<MetaKey, String>(&mut asset.id, meta_key);
            *existing = value;
        } else {
            df::add(&mut asset.id, meta_key, value);
        }
    }

    public fun has_metadata(asset: &Asset, key: String): bool {
        df::exists(&asset.id, MetaKey { key })
    }

    public fun get_metadata(asset: &Asset, key: String): &String {
        df::borrow<MetaKey, String>(&asset.id, MetaKey { key })
    }

    // Mint a new Share NFT against an Asset and transfer it to receiver
    public fun mint_share(
        _: &mut AdminCap,
        asset: &mut Asset,
        amount: u64,
        receiver: address,
        ctx: &mut TxContext
    ) {
        let remaining = asset.available_shares;
        assert!(amount <= remaining, EInsufficientShares);
        asset.available_shares = remaining - amount;

        let is_receiver_shareholder = df::exists(&asset.id, receiver);
        if (is_receiver_shareholder) {
            let holding = df::borrow_mut<address, Holding>(&mut asset.id, receiver);
            holding.value = holding.value + amount;
        } else {
            df::add(&mut asset.id, receiver, Holding { value: amount });
        };

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

        transfer::transfer(share, receiver);
    }

    // Transfer a Share to a new owner, keeping per-holder DF balances current
    public fun transfer_share(
        asset: &mut Asset,
        share: Share,
        new_owner: address,
        ctx: &mut TxContext
    ) {
        let is_receiver_shareholder = df::exists(&asset.id, new_owner);
        if (is_receiver_shareholder) {
            let receiver_holding = df::borrow_mut<address, Holding>(&mut asset.id, new_owner);
            receiver_holding.value = receiver_holding.value + share.amount;
        } else {
            df::add(&mut asset.id, new_owner, Holding { value: share.amount });
        };

        let sender_holding = df::borrow_mut<address, Holding>(&mut asset.id, tx_context::sender(ctx));
        sender_holding.value = sender_holding.value - share.amount;

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

    // Burn a Share after the ITO has finished, returning the amount
    public fun safe_burn_share(asset: &Asset, share: Share): u64 {
        assert!(object::uid_to_inner(&asset.id) == share.asset_id, EInvalidAsset);
        assert!(asset.available_shares == 0, EITONotFinished);
        burn_share(share)
    }

    // Merge share2 into share1 (burns share2)
    public fun merge_shares(share1: &mut Share, share2: Share) {
        assert!(share1.asset_id == share2.asset_id, EIncompatibleShareTypes);
        let amount2 = burn_share(share2);
        share1.amount = share1.amount + amount2;
    }

    // Split off `amount` from `share` into a new Share returned to the sender
    public fun split_share(share: &mut Share, amount: u64, ctx: &mut TxContext) {
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
        transfer::transfer(new_share, tx_context::sender(ctx));
    }

    // Update the outgoing (exit) price of an Asset
    public fun update_outgoing_price(_: &AdminCap, asset: &mut Asset, new_outgoing_price: u64) {
        asset.outgoing_price = new_outgoing_price;
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

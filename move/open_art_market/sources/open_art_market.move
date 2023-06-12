module open_art_market::open_art_market {

    // std lib imports
    use std::string::{String};

    // Sui imports
    use sui::transfer;
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::package::{Self};

    // Error codes
    const EInsufficientShares: u64 = 0;
    const EIncompatibleShardTypes: u64 = 1;
    const EInvalidArtwork: u64 = 2;
    const EITONotFinished: u64 = 3;
    const EInvalidSupply: u64 = 4;
    const EInvalidIncomingPrice: u64 = 5;
    const EinvalidOutgoingPrice: u64 = 6;

    // Structs
    // An ArtworkShard NFT
    // Represents shares of an Artwork NFT and it is owned by a shareholder
    struct ArtworkShard has key, store{
        id: UID,
        artwork_id: ID,
        shares: u64,
        incoming_price: u64,
        artwork_name: String,
        artist: String,
        creation_date: u64,
        description: String,
        image_url: String,
    }

    // The Artwork NFT struct
    // This object is only created by the admin and should be shared
    struct Artwork has key, store{
        id: UID,
        total_supply: u64,
        shares: u64,
        incoming_price: u64,
        outgoing_price: u64,
        name: String,
        artist: String,
        creation_date: u64,
        description: String,
        image_url: String,
    }

    // Admin capability to guard access restricted methods
    struct AdminCap has key, store {
        id: UID
    }

    // One time witness to create the publisher
    struct OPEN_ART_MARKET has drop {}

    // Functions
    // Called upon contract deployment
    fun init(otw: OPEN_ART_MARKET, ctx: &mut TxContext) {
        package::claim_and_keep(otw, ctx);
        let admin_cap = AdminCap {id: object::new(ctx)};
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    // Create a new Artwork NFT shared object
    public fun mint_artwork_and_share(
        _: &mut AdminCap, total_supply: u64, incoming_price: u64,
        outgoing_price: u64, name: String, artist: String,
        creation_date: u64, description: String,
        image_url: String, ctx: &mut TxContext
    ) {

        // Ensure that numeric values are larger than 0
        assert!(total_supply > 0, EInvalidSupply);
        assert!(incoming_price > 0, EInvalidIncomingPrice);
        assert!(outgoing_price > 0, EinvalidOutgoingPrice);

        let artwork = Artwork {
            id: object::new(ctx),
            total_supply,
            shares: total_supply,
            incoming_price,
            outgoing_price,
            name,
            artist,
            creation_date,
            description,
            image_url
        };
        transfer::public_share_object<Artwork>(artwork);
    }

    // Create an ArtworkShard NFT
    public fun mint_artwork_shard(_: &mut AdminCap, artwork: &mut Artwork, shares: u64, ctx: &mut TxContext): ArtworkShard {
        let remaining_shares = artwork.shares;

        // Ensure that artwork has sufficient shares available to create the shard
        assert!(shares <= remaining_shares, EInsufficientShares);

        let new_shares_balance = remaining_shares - shares;
        artwork.shares = new_shares_balance;
        ArtworkShard {
            id: object::new(ctx),
            artwork_id: object::uid_to_inner(&artwork.id),
            shares,
            incoming_price: artwork.incoming_price,
            artwork_name: artwork.name,
            artist: artwork.artist,
            creation_date: artwork.creation_date,
            description: artwork.description,
            image_url: artwork.image_url,
        }
    }

    // CAUTION: Internal helper method, this can burn shards with shares in them
    fun burn_artwork_shard(artwork_shard: ArtworkShard): u64 {
        let ArtworkShard {
            id,
            artwork_id: _,
            shares,
            incoming_price: _,
            artwork_name: _,
            artist: _,
            creation_date: _,
            description: _,
            image_url: _,
        } = artwork_shard;

        object::delete(id);
        shares
    }

    // Burns a shard after checking the ITO has finished and returns the number of shares it contained
    public fun safe_burn_artwork_shard(artwork: &Artwork, artwork_shard: ArtworkShard): u64 {

        // Ensure that the shard belongs to the artwork
        assert!(object::uid_to_inner(&artwork.id) == artwork_shard.artwork_id, EInvalidArtwork);

        // Ensure that the ITO has finished
        assert!(artwork.shares == 0, EITONotFinished);  

        burn_artwork_shard(artwork_shard)

    }

    public fun merge_artwork_shards(artwork_shard1: &mut ArtworkShard, artwork_shard2: ArtworkShard) {

        // Ensure that both shards belong to the same artwork
        assert!(artwork_shard1.artwork_id == artwork_shard2.artwork_id, EIncompatibleShardTypes);

        let artowork_shard2_shares = burn_artwork_shard(artwork_shard2);

        artwork_shard1.shares = artwork_shard1.shares + artowork_shard2_shares;
        
    }

    // @todo: do we need a split method?

    // Accessors

    public fun get_shard_artwork_id(artwork_shard: &ArtworkShard): ID {
        artwork_shard.artwork_id
    }

    public fun get_shard_shares(artwork_shard: &ArtworkShard): u64 {
        artwork_shard.shares
    }

}
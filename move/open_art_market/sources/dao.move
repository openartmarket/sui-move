module open_art_market::dao {

    // Std imports
    use std::string::{String};

    // Sui imports
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext}; 
    use sui::table::{Self, Table};
    use sui::transfer::{Self};

    // Module imports
    use open_art_market::open_art_market::{Self as oam, ArtworkShard, AdminCap};

    // Error codes
    const ECallerNotAShareHolder: u64 = 0;
    const ECallerAlreadyVoted: u64 = 1;
    const EVotingPeriodEnded: u64 = 2;

    // Structs
    struct Vote has store, drop {
        weight: u64,
        choice: bool,
    }

    // This struct represents a question that can be voted on by shareholders
    struct VoteRequest has key, store {
        id: UID,
        artwork_id: ID,
        request: String,
        vote_record: Table<address, Vote>, // maps addresses to their vote
        is_active: bool,
        // @todo add a way to limit the voting period with the clock
    }

    // Functions

    /// This function creates a new vote request
    public fun create_vote_request(_: &mut AdminCap, artwork_id: ID, request: String, ctx: &mut TxContext) {

        let vote_request = VoteRequest {
            id: object::new(ctx),
            artwork_id,
            request,
            vote_record: table::new<address, Vote>(ctx),
            is_active: true,
        };
        transfer::public_share_object<VoteRequest>(vote_request);
    }

    /// This function allows shareholder to vote for a vote request
    /// This function assumes that the user has only one shard of an artwork
    /// If the user has more than one shards of an artwork, it should be merged into one shard before voting with open_art_market::merge_artwork_shards
    public fun vote(artwork_shard: &mut ArtworkShard, vote_request: &mut VoteRequest, choice: bool, ctx: &mut TxContext) {

        // Make sure that the caller has shares of the artwork that the question was posted for and vote request period has not ended yet
        assert!(oam::get_shard_artwork_id(artwork_shard) == vote_request.artwork_id, ECallerNotAShareHolder);
        assert!(vote_request.is_active == true, EVotingPeriodEnded);

        // Make sure that the caller has not voted yet
        let sender = tx_context::sender(ctx);
        let has_voted = table::contains<address, Vote>(&vote_request.vote_record, sender);
        assert!(has_voted == false, ECallerAlreadyVoted);

        // Update the vote record
        let vote = Vote {
            weight: oam::get_shard_shares(artwork_shard),
            choice,
        };
        
        table::add(&mut vote_request.vote_record, sender, vote);
    }
        
}
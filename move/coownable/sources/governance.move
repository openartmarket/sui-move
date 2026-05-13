module coownable::governance {

    // Std imports
    use std::string::{String};

    // Sui imports
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::dynamic_field::{Self as df};

    // Module imports
    use coownable::asset::{Self as ca, Asset, Holding, AdminCap};

    // Error codes
    const ECallerNotAShareHolder: u64 = 0;
    const ECallerAlreadyVoted: u64 = 1;
    const EVotingPeriodEnded: u64 = 2;

    // A single shareholder's vote on a Motion
    struct Vote has store {
        choice: bool,
    }

    // A motion put to a vote by an Asset's shareholders
    struct Motion has key, store {
        id: UID,
        asset_id: ID,
        request: String,
        yes_votes: u64,
        no_votes: u64,
        is_active: bool,
        // @todo cap the voting period via the clock
    }

    // Open a motion for shareholders of an Asset to vote on
    public fun start_motion(_: &mut AdminCap, asset_id: ID, request: String, ctx: &mut TxContext) {
        let motion = Motion {
            id: object::new(ctx),
            asset_id,
            request,
            yes_votes: 0,
            no_votes: 0,
            is_active: true,
        };
        transfer::public_share_object<Motion>(motion);
    }

    /// Cast a vote on a Motion. Assumes the caller has consolidated their
    /// Share NFTs into a single holding via `coownable::asset::merge_shares`
    /// before voting.
    public fun cast_vote(asset: &Asset, motion: &mut Motion, choice: bool, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);

        // The caller must hold shares in the asset this motion targets
        let asset_uid = ca::get_asset_uid(asset);
        assert!(df::exists(asset_uid, sender) == true, ECallerNotAShareHolder);
        // Voting must still be open
        assert!(motion.is_active == true, EVotingPeriodEnded);
        // Each shareholder may only vote once
        let has_voted = df::exists(&motion.id, sender);
        assert!(has_voted == false, ECallerAlreadyVoted);

        let holding = df::borrow<address, Holding>(asset_uid, sender);
        let weight = ca::get_holding_value(holding);
        if (choice == true) {
            motion.yes_votes = motion.yes_votes + weight;
        } else {
            motion.no_votes = motion.no_votes + weight;
        };

        df::add(&mut motion.id, sender, Vote { choice });
    }

    // Close a Motion to further votes
    public fun end_motion(_: &AdminCap, motion: &mut Motion) {
        motion.is_active = false;
    }
}

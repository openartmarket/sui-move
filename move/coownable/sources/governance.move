module coownable::governance {

    // Std imports
    use std::string::{String};

    // Sui imports
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::dynamic_field::{Self as df};
    use sui::event;

    // Module imports
    use coownable::asset::{Self as ca, Asset, Holding, AdminCap};

    // Error codes
    const ECallerNotAShareHolder: u64 = 0;
    const ECallerAlreadyVoted: u64 = 1;
    const EVotingPeriodEnded: u64 = 2;

    // A single shareholder's vote on a Motion. Recording `weight` makes
    // audits cheap and survives any future "withdraw vote" feature.
    struct Vote has store {
        choice: bool,
        weight: u64,
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

    // Events.

    struct MotionStarted has copy, drop {
        motion_id: ID,
        asset_id: ID,
        request: String,
    }

    struct VoteCast has copy, drop {
        motion_id: ID,
        asset_id: ID,
        voter: address,
        choice: bool,
        weight: u64,
    }

    struct MotionEnded has copy, drop {
        motion_id: ID,
        asset_id: ID,
        yes_votes: u64,
        no_votes: u64,
    }

    // Open a motion for shareholders of an Asset to vote on
    public fun start_motion(_: &AdminCap, asset_id: ID, request: String, ctx: &mut TxContext) {
        let motion = Motion {
            id: object::new(ctx),
            asset_id,
            request,
            yes_votes: 0,
            no_votes: 0,
            is_active: true,
        };
        event::emit(MotionStarted {
            motion_id: object::uid_to_inner(&motion.id),
            asset_id: motion.asset_id,
            request: motion.request,
        });
        transfer::public_share_object<Motion>(motion);
    }

    /// Cast a vote on a Motion. Vote weight is the caller's current
    /// aggregate Holding on the Asset.
    public fun cast_vote(asset: &Asset, motion: &mut Motion, choice: bool, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);

        let asset_uid = ca::get_asset_uid(asset);
        assert!(df::exists(asset_uid, sender), ECallerNotAShareHolder);
        assert!(motion.is_active, EVotingPeriodEnded);
        assert!(!df::exists(&motion.id, sender), ECallerAlreadyVoted);

        let holding = df::borrow<address, Holding>(asset_uid, sender);
        let weight = ca::get_holding_value(holding);
        if (choice) {
            motion.yes_votes = motion.yes_votes + weight;
        } else {
            motion.no_votes = motion.no_votes + weight;
        };

        df::add(&mut motion.id, sender, Vote { choice, weight });

        event::emit(VoteCast {
            motion_id: object::uid_to_inner(&motion.id),
            asset_id: motion.asset_id,
            voter: sender,
            choice,
            weight,
        });
    }

    // Close a Motion to further votes
    public fun end_motion(_: &AdminCap, motion: &mut Motion) {
        motion.is_active = false;
        event::emit(MotionEnded {
            motion_id: object::uid_to_inner(&motion.id),
            asset_id: motion.asset_id,
            yes_votes: motion.yes_votes,
            no_votes: motion.no_votes,
        });
    }
}

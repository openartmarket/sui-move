module coownable::governance {

    // Std imports
    use std::string::{String};

    // Sui imports
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer::{Self};
    use sui::dynamic_field::{Self as df};
    use sui::event;
    use sui::clock::{Self, Clock};

    // Module imports
    use coownable::asset::{Self as ca, Asset, Holding, AdminCap};

    // Error codes
    const ECallerNotAShareHolder: u64 = 0;
    const ECallerAlreadyVoted: u64 = 1;
    const EVotingPeriodEnded: u64 = 2;
    const EMotionNotExpired: u64 = 3;
    const EAssetMismatch: u64 = 4;

    // A single shareholder's vote on a Motion. Records `weight` so audits
    // don't need to replay Holdings, and so the vote stays meaningful if
    // the underlying balance ever changes.
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
        deadline_ms: u64,
    }

    // Events.

    struct MotionStarted has copy, drop {
        motion_id: ID,
        asset_id: ID,
        request: String,
        deadline_ms: u64,
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

    /// Open a motion for shareholders of an Asset to vote on. Bumps the
    /// asset's `active_motion_count` so Share movement is frozen for the
    /// duration of the motion — preventing vote-weight manipulation
    /// (e.g. minting extra shares to a confederate after motion start).
    /// `duration_ms` is added to the current clock time to set the
    /// voting deadline.
    public fun start_motion(
        _: &AdminCap,
        asset: &mut Asset,
        request: String,
        duration_ms: u64,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let asset_id = object::uid_to_inner(ca::get_asset_uid(asset));
        let deadline_ms = clock::timestamp_ms(clock) + duration_ms;
        let motion = Motion {
            id: object::new(ctx),
            asset_id,
            request,
            yes_votes: 0,
            no_votes: 0,
            is_active: true,
            deadline_ms,
        };
        ca::bump_active_motion(asset);
        event::emit(MotionStarted {
            motion_id: object::uid_to_inner(&motion.id),
            asset_id: motion.asset_id,
            request: motion.request,
            deadline_ms,
        });
        transfer::public_share_object<Motion>(motion);
    }

    /// Cast a vote on a Motion. Vote weight is the caller's current
    /// aggregate Holding on the Asset — safe to read at vote time because
    /// `start_motion` froze share movement.
    public fun cast_vote(
        asset: &Asset,
        motion: &mut Motion,
        choice: bool,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let asset_uid = ca::get_asset_uid(asset);
        let asset_id = object::uid_to_inner(asset_uid);
        assert!(asset_id == motion.asset_id, EAssetMismatch);
        assert!(df::exists(asset_uid, sender), ECallerNotAShareHolder);
        assert!(motion.is_active, EVotingPeriodEnded);
        assert!(clock::timestamp_ms(clock) <= motion.deadline_ms, EVotingPeriodEnded);
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

    /// Admin override: close a Motion early. Releases the Asset's
    /// active-motion lock so Share movement resumes.
    public fun end_motion(_: &AdminCap, asset: &mut Asset, motion: &mut Motion) {
        let asset_id = object::uid_to_inner(ca::get_asset_uid(asset));
        assert!(asset_id == motion.asset_id, EAssetMismatch);
        finalize_motion(asset, motion);
    }

    /// Permissionless: anyone can close a Motion whose deadline has
    /// passed. Releases the Asset's active-motion lock.
    public fun finalize_expired_motion(
        asset: &mut Asset,
        motion: &mut Motion,
        clock: &Clock,
    ) {
        let asset_id = object::uid_to_inner(ca::get_asset_uid(asset));
        assert!(asset_id == motion.asset_id, EAssetMismatch);
        assert!(clock::timestamp_ms(clock) > motion.deadline_ms, EMotionNotExpired);
        finalize_motion(asset, motion);
    }

    fun finalize_motion(asset: &mut Asset, motion: &mut Motion) {
        if (motion.is_active) {
            motion.is_active = false;
            ca::release_active_motion(asset);
        };
        event::emit(MotionEnded {
            motion_id: object::uid_to_inner(&motion.id),
            asset_id: motion.asset_id,
            yes_votes: motion.yes_votes,
            no_votes: motion.no_votes,
        });
    }
}

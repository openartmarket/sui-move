module open_art_market::dao {

    // Std imports
    use std::string::{String};

    // Sui imports
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext}; 
    use sui::transfer::{Self};
    use sui::dynamic_field::{Self as df};


    // Module imports
    use open_art_market::open_art_market::{Self as oam, Contract, Shares, AdminCap};

    // Error codes
    const ECallerNotAShareHolder: u64 = 0;
    const ECallerAlreadyVoted: u64 = 1;
    const EVotingPeriodEnded: u64 = 2;

    // Structs
    struct Vote has store {
        choice: bool,
    }

    // This struct represents a question that can be voted on by shareholders
    struct VoteRequest has key, store {
        id: UID,
        contract_id: ID,
        request: String,
        yes_votes: u64,
        no_votes: u64,
        is_active: bool,
        // @todo add a way to limit the voting period with the clock
    }

    // Functions

    /// This function creates a new vote request
    public fun start_vote(_: &mut AdminCap, contract_id: ID, request: String, ctx: &mut TxContext) {

        let vote_request = VoteRequest {
            id: object::new(ctx),
            contract_id,
            request,
            yes_votes: 0,
            no_votes: 0,
            is_active: true,
        };
        transfer::public_share_object<VoteRequest>(vote_request);
    }

    /// This function allows shareholder to vote for a vote request
    /// This function assumes that the user has only one stock of an contract
    /// If the user has more than one stocks of an contract, it should be merged into one stock before voting with open_art_market::merge_contract_stocks
    public fun vote(contract: &Contract, vote_request: &mut VoteRequest, choice: bool, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);

        // Make sure that the caller has shares of the contract that the question was posted for
        let contract_id = oam::get_contract_id(contract);
        assert!(df::exists_(contract_id, sender) == true, ECallerNotAShareHolder);
        // Ensure that vote request period has not ended
        assert!(vote_request.is_active == true, EVotingPeriodEnded);
        // Make sure that the caller has not voted yet
        let has_voted = df::exists_(&mut vote_request.id, sender);
        assert!(has_voted == false, ECallerAlreadyVoted);

        let caller_shares_s = df::borrow<address, Shares>(oam::get_contract_id(contract), sender);
        let caller_shares = oam::get_user_shares(caller_shares_s);
        // Update the vote record
        if(choice == true) {
            vote_request.yes_votes = vote_request.yes_votes + caller_shares;
        } else {
            vote_request.no_votes = vote_request.no_votes + caller_shares;
        };

        // Record that this user has already voted
        df::add(&mut vote_request.id, sender, Vote { choice });
    }

    // Function to end the voting period
    public fun end_vote(_: &AdminCap, vote_request: &mut VoteRequest) {
        vote_request.is_active = false;
    }
        
}

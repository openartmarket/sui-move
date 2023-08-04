module open_art_market::open_art_market {

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
    const EIncompatibleStockTypes: u64 = 1;
    const EInvalidContract: u64 = 2;
    const EITONotFinished: u64 = 3;
    const EInvalidSupply: u64 = 4;
    const EInvalidSharePrice: u64 = 5;
    const EInvalidMultiplier: u64 = 6;
    const EInvalidShares: u64 = 7;
    const ECallerNotAShareHolder: u64 = 8;

    // Structs
    // An ContractStock NFT
    // Represents shares of an Contract NFT and it is owned by a shareholder
    struct ContractStock has key {
        id: UID,
        contract_id: ID,
        shares: u64,
        share_price: u64,
        contract_name: String,
        artist: String,
        creation_date: u64,
        description: String,
        currency: String,
        reference: String,
    }

    // The Contract NFT struct
    // This object is only created by the admin and should be shared
    // @todo: make the contract an NFT that is wrapped around another
    // struct so we can eventually transfer it outside of the Wrapper once sold
    // to the buyer (not a requirement right now but seems optimal)
    struct Contract has key, store{
        id: UID,
        total_supply: u64,
        shares: u64,
        share_price: u64,
        outgoing_price: u64,
        multiplier: u64,
        name: String,
        artist: String,
        creation_date: u64,
        description: String,
        currency: String,
        reference: String,
    }

    // Admin capability to guard access restricted methods
    struct AdminCap has key, store {
        id: UID
    }

    // One time witness to create the publisher
    struct OPEN_ART_MARKET has drop {}

    struct Shares has store {
        // user: address,
        value: u64
    }

    // Functions
    // Called upon contract deployment
    fun init(otw: OPEN_ART_MARKET, ctx: &mut TxContext) {
        package::claim_and_keep(otw, ctx);
        let admin_cap = AdminCap {id: object::new(ctx)};
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }
    
    // Create a new Contract NFT shared object
    public fun mint_contract(
        _: &mut AdminCap, total_supply: u64, share_price: u64, multiplier: u64, name: String, artist: String,
        creation_date: u64, description: String, currency: String,
        reference: String, ctx: &mut TxContext
    ) {

        // Ensure that numeric values are larger than 0
        assert!(total_supply > 0, EInvalidSupply);
        assert!(share_price > 0, EInvalidSharePrice);
        assert!(multiplier > 0, EInvalidMultiplier);

        let outgoing_price = (share_price * total_supply) * multiplier;

        let contract = Contract {
            id: object::new(ctx),
            total_supply,
            shares: total_supply,
            share_price,
            outgoing_price,
            multiplier,
            name,
            artist,
            creation_date,
            description,
            currency,
            reference
        };
        transfer::public_share_object<Contract>(contract);
    }

    // Create an ContractStock NFT
    public fun mint_contract_stock(_: &mut AdminCap, contract: &mut Contract, shares: u64, receiver: address, ctx: &mut TxContext) {
        let remaining_shares = contract.shares;

        // Ensure that contract has sufficient shares available to create the stock
        assert!(shares <= remaining_shares, EInsufficientShares);

        let new_shares_balance = remaining_shares - shares;
        contract.shares = new_shares_balance;

        let is_receiver_shareholder = df::exists_(&contract.id, receiver);

        if(is_receiver_shareholder){
            let df_shares = df::borrow_mut<address, Shares>(&mut contract.id, receiver);
            df_shares.value = df_shares.value + shares;
        }else {
            df::add(&mut contract.id, receiver, Shares {value: shares} );
        };

        let contract_stock = ContractStock {
            id: object::new(ctx),
            contract_id: object::uid_to_inner(&contract.id),
            shares,
            share_price: contract.share_price,
            contract_name: contract.name,
            artist: contract.artist,
            creation_date: contract.creation_date,
            description: contract.description,
            currency: contract.currency,
            reference: contract.reference,
        };

        transfer::transfer(contract_stock, receiver);
    }

    public fun transfer_contract_stock(contract: &mut Contract, contract_stock: ContractStock, new_owner: address, ctx: &mut TxContext) {
        // @todo: what checks need to be made here?
        let is_receiver_shareholder = df::exists_(&contract.id, new_owner);

        // Make sure the df share balances of receiver under contract are kept up to date
        if(is_receiver_shareholder) {
            let df_receiver_shares = df::borrow_mut<address, Shares>(&mut contract.id, new_owner);
            df_receiver_shares.value = df_receiver_shares.value + contract_stock.shares;
        } else {
            df::add(&mut contract.id, new_owner, Shares {value: contract_stock.shares});
        };

        // Make sure the df share balances of sender under contract are kept up to date
        let df_sender_shares = df::borrow_mut<address, Shares>(&mut contract.id, tx_context::sender(ctx));
        df_sender_shares.value = df_sender_shares.value - contract_stock.shares;

        transfer::transfer(contract_stock, new_owner);
    }

    // CAUTION: Internal helper method, this can burn stocks with shares in them
    fun burn_contract_stock(contract_stock: ContractStock): u64 {
        let ContractStock {
            id,
            contract_id: _,
            shares,
            share_price: _,
            contract_name: _,
            artist: _,
            creation_date: _,
            description: _,
            currency: _,
            reference: _,
        } = contract_stock;

        object::delete(id);
        shares
    }

    // Burns a stock after checking the ITO has finished and returns the number of shares it contained
    public fun safe_burn_contract_stock(contract: &Contract, contract_stock: ContractStock): u64 {

        // Ensure that the stock belongs to the contract
        assert!(object::uid_to_inner(&contract.id) == contract_stock.contract_id, EInvalidContract);

        // Ensure that the ITO has finished
        assert!(contract.shares == 0, EITONotFinished);  

        burn_contract_stock(contract_stock)

    }

    // Function to merge two stocks owned by the same user
    public fun merge_contract_stocks(contract_stock1: &mut ContractStock, contract_stock2: ContractStock) {

        // Ensure that both stocks belong to the same contract
        assert!(contract_stock1.contract_id == contract_stock2.contract_id, EIncompatibleStockTypes);

        let contract_stock2_shares = burn_contract_stock(contract_stock2);

        contract_stock1.shares = contract_stock1.shares + contract_stock2_shares;
        
    }


    // @todo: method for setting the currency type (can be done at minting time)

    // Open Art Market & Contract Owner (person coming with the contract to the market) has shares allocated for sale. 
    // We will create those Contract Stocks as the first action after minting the Contract
    // Function to split a stock into two stocks
    public fun split_contract_stock(contract_stock: &mut ContractStock, shares: u64, ctx: &mut TxContext) {
        // Ensure that the original stock has sufficient shares to split
        assert!(contract_stock.shares > shares, EInsufficientShares);
        
        // Create new stock with remaining shares
        let contract_stock2 = ContractStock {
            id: object::new(ctx),
            contract_id: contract_stock.contract_id,
            shares,
            share_price: contract_stock.share_price,
            contract_name: contract_stock.contract_name,
            artist: contract_stock.artist,
            creation_date: contract_stock.creation_date,
            description: contract_stock.description,
            currency: contract_stock.currency,
            reference: contract_stock.reference,
        };

        // Update shares of original stock
        let remaining_shares = contract_stock.shares - shares;
        contract_stock.shares = remaining_shares;

        // Transfer new stock to sender
        transfer::transfer(contract_stock2, tx_context::sender(ctx));
    }

    // Function to update the outgoing price of an Contract
    public fun update_outgoing_price(_: &AdminCap, contract: &mut Contract, new_outgoing_price: u64) {
        contract.outgoing_price = new_outgoing_price;
    }

    // Accessors

    public fun get_stock_contract_id(contract_stock: &ContractStock): ID {
        contract_stock.contract_id
    }

    public fun get_stock_shares(contract_stock: &ContractStock): u64 {
        contract_stock.shares
    }

    public fun get_contract_id(contract: &Contract): &UID {
        &contract.id
    }

    public fun get_user_shares(shares: &Shares): u64 {
        shares.value
    }

    // Function for getting available shares for sale
    public fun get_available_shares_for_sale(contract: &Contract): u64 {
        contract.shares
    }

}

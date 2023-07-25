
import {createContractDisplay} from '../src/contract_display';
import {createContractStockDisplay} from "../src/contract_stock_display";
import {
    ADMIN_PHRASE,
    CONTRACT_STOCK_TYPE,
    CONTRACT_TYPE,
    PUBLISHER_ID,
    SUI_NETWORK,
} from '../test/test-helpers'

async function main (){
    await createContractDisplay({
        ADMIN_PHRASE,
        CONTRACT_TYPE,
        PUBLISHER_ID,
        SUI_NETWORK,
    });
    await createContractStockDisplay({
        ADMIN_PHRASE,
        CONTRACT_STOCK_TYPE,
        PUBLISHER_ID,
        SUI_NETWORK,
    });
}

main();

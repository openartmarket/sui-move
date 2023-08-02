
import {createContractDisplay} from '../src/contract_display';
import {createContractStockDisplay} from "../src/contract_stock_display";
import { NetworkName } from '../src/types';
import {
    ADMIN_PHRASE,
    CONTRACT_STOCK_TYPE,
    CONTRACT_TYPE,
    PUBLISHER_ID,
    SUI_NETWORK,
} from '../test/test-helpers'

async function main (){
    console.log('Creating contract display and contract stock display...', SUI_NETWORK)

    await createContractDisplay({
        ADMIN_PHRASE,
        CONTRACT_TYPE,
        PUBLISHER_ID,
        SUI_NETWORK: (SUI_NETWORK as NetworkName),
    });
    await createContractStockDisplay({
        ADMIN_PHRASE,
        CONTRACT_STOCK_TYPE,
        PUBLISHER_ID,
        SUI_NETWORK: (SUI_NETWORK as NetworkName),
    });
}

main();

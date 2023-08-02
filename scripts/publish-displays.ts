
import {createContractDisplay} from '../src/contract_display';
import {createContractStockDisplay} from "../src/contract_stock_display";
import { NetworkName } from '../src/types';
import {
    ADMIN_PHRASE,
    CONTRACT_STOCK_TYPE,
    CONTRACT_TYPE,
    getEnv,
    PUBLISHER_ID,
} from '../test/test-helpers'

const SUI_NETWORK_NAME = getEnv('SUI_NETWORK');

async function main (){
    console.log('Creating contract display and contract stock display...', SUI_NETWORK_NAME)

    await createContractDisplay({
        ADMIN_PHRASE,
        CONTRACT_TYPE,
        PUBLISHER_ID,
        SUI_NETWORK: (SUI_NETWORK_NAME as NetworkName),
    });
    await createContractStockDisplay({
        ADMIN_PHRASE,
        CONTRACT_STOCK_TYPE,
        PUBLISHER_ID,
        SUI_NETWORK: (SUI_NETWORK_NAME as NetworkName),
    });
}

main();

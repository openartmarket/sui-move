import { fromB64 } from "@mysten/bcs";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { buildGaslessTransactionBytes } from "@shinami/clients";
export class SuiExecutor {
    params;
    constructor(params) {
        this.params = params;
    }
    async execute(build) {
        const txb = new TransactionBlock();
        const { suiClient, packageId, keypair } = this.params;
        build(txb, packageId);
        const response = await suiClient.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: txb,
            requestType: "WaitForLocalExecution",
            options: {
                showObjectChanges: true,
                showEffects: true,
            },
        });
        return checkResponse(response);
    }
}
const SUI_GAS_FEE_LIMIT = 5_000_000;
export class ShinamiExecutor {
    params;
    constructor(params) {
        this.params = params;
    }
    async execute(build) {
        const { suiClient, gasClient, packageId, onBehalfOf, signer } = this.params;
        const gaslessTx = await buildGaslessTransactionBytes({
            sui: suiClient,
            build: async (txb) => build(txb, packageId),
        });
        const { txBytes, signature: gasSignature } = await gasClient.sponsorTransactionBlock(gaslessTx, onBehalfOf, SUI_GAS_FEE_LIMIT);
        // Sign the sponsored tx.
        const { signature } = await signer.signTransactionBlock(fromB64(txBytes));
        const signatures = [signature, gasSignature];
        // Execute the sponsored & signed tx.
        const response = await suiClient.executeTransactionBlock({
            transactionBlock: txBytes,
            signature: signatures,
            requestType: "WaitForLocalExecution",
            options: {
                showObjectChanges: true,
                showEffects: true,
            },
        });
        return checkResponse(response);
    }
}
function checkResponse(response) {
    const { effects } = response;
    if (!effects) {
        throw new Error("Failed to get execution effects");
    }
    const { status } = effects;
    if (status.error) {
        throw new Error(status.error);
    }
    if (status.status !== "success") {
        throw new Error(`Transaction failed with status: ${status}`);
    }
    return response;
}
//# sourceMappingURL=Executor.js.map
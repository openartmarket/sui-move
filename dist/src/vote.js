export async function vote(executor, params) {
    const { contractId, motionId, choice } = params;
    const response = await executor.execute(async (txb, packageId) => {
        txb.moveCall({
            target: `${packageId}::dao::vote`,
            arguments: [txb.object(contractId), txb.object(motionId), txb.pure(choice)],
        });
    });
    const { digest } = response;
    return { digest };
}
//# sourceMappingURL=vote.js.map
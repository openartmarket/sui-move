export async function endMotion(executor, params) {
    const { adminCapId, motionId } = params;
    const response = await executor.execute(async (txb, packageId) => {
        txb.moveCall({
            target: `${packageId}::dao::end_vote`,
            arguments: [txb.object(adminCapId), txb.object(motionId)],
        });
    });
    const { digest } = response;
    return { digest };
}
//# sourceMappingURL=endMotion.js.map
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy(process.env.SMART_CONTRACT_NAME, {
        from: deployer,
        args: [],
        log: true,
    });
};
module.exports.tags = [process.env.SMART_CONTRACT_NAME];
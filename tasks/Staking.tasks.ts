import { task } from "hardhat/config";

// const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // for localhost network:
const ContractAddress = "0x879a56D917aaaD654e3372E3f9761509D7168967" // for Rinkeby network;
const UniswapV2Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" // for getting LP tokens

task("rewardPercent", "Prints reward percent of staking")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        let rewardPercent = await StakingInterface.rewardPercent()
        rewardPercent = rewardPercent.toString()
        console.log("Reward percent of staking is:",rewardPercent)
    })

task("percentDecimals", "Prints decimals of reward percent")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        let percentDecimals = await StakingInterface.percentDecimals()
        percentDecimals = percentDecimals.toString()
        console.log("Decimals of reward percent is:",percentDecimals)
    })

task("stakeTime", "Prints stake time of staking")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        let stakeTime = await StakingInterface.stakeTime()
        stakeTime = stakeTime.toString()
        console.log("Stake time of staking in seconds is:", stakeTime )
    })

task("stakingProviders", "Prints info of staking provider")
    .addParam("address", "Put address you want info about")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        let stakingProviders = await StakingInterface.stakingProviders(taskArgs.address)
        console.log(`Staked tokens: ${stakingProviders.stakedTokens}; Reward tokens: ${stakingProviders.rewardTokens}; Freeze time: ${stakingProviders.freezeTime};`)
    })


task("stake", "Stake your LP tokens to contract")
    .addParam("amount", "Amount of LP tokens to stake")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        await StakingInterface.stake(taskArgs.amount)
        console.log(`You have staked: ${taskArgs.amount} LP tokens`)
    })

task("claim", "Get your reward tokens from contract")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        await StakingInterface.claim()
        console.log(`You have gotten your reward tokens`)
    })

task("unstake", "Receive your LP tokens from contract")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        await StakingInterface.unstake()
        console.log(`You have gotten returned your staked LP tokens`)
    })

task("changeStakeTime", "Sets new stake time in seconds")
    .addParam("time", "Seconds to set new time for staking")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        await StakingInterface.changeStakeTime(taskArgs.time)
        console.log("New time for staking in seconds is:", taskArgs.time)
    })

task("changeRewardTokens", "Sets new percent of reward for staking")
    .addParam("percent", "Percent of staking tokens for reward")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        await StakingInterface.changeRewardTokens(taskArgs.percent)
        console.log("New percent of reward is:", taskArgs.percent)
    })

task("giveChangerRights", "Adds new account as a CHANGER")
    .addParam("address", "Address to make a CHANGER")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        await StakingInterface.giveChangerRights(taskArgs.address)
        console.log("New CHANGER is:", taskArgs.address)
    })

task("revokeChangerRights", "Revoke account as a CHANGER")
    .addParam("address", "Address to revoke as CHANGER")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        await StakingInterface.revokeChangerRights(taskArgs.address)
        console.log(taskArgs.address,"Now is not a CHANGER")
    })


task("addLiquidityETH", "Adds liquidity pool UNI-V2/QTN to uniswap")
    .addParam("amounttokendesired", "Amount of token to add as liquidity")
    .addParam("amounttokenmin", "WETH/token price can go up")
    .addParam("amountethmin", "The extent to which the token/WETH price can go up")
    .addParam("to", "Recipient address of the liquidity tokens")
    .addParam("deadline", "Unix timestamp after which the transaction will revert")
    .setAction(async (taskArgs, hre) => {
        const RewardQTNaddress = "0x04d9dfeA1b3815B62B7E105AF570A742a2Ba6334" // reward QuokkaToken token address;
        const UniswapV2Interface = await hre.ethers.getContractAt("IUniswapV2Router02", UniswapV2Address)
        await UniswapV2Interface.addLiquidityETH(
            RewardQTNaddress, 
            taskArgs.amounttokendesired, 
            taskArgs.amounttokenmin, 
            taskArgs.amountethmin,
            taskArgs.to,
            taskArgs.deadline,
            {value: 1000000000000000}
            )
        console.log(`V2 Liquidity pool added ETH has been paid`)
    })

    // command below I use to addLiquidityETH
    // npx hardhat addLiquidityETH --amounttokendesired 10000000000000000 --amounttokenmin 0 --amountethmin 1000000000000000000 --to 0xa162B39F86A7341948A2E0A8DaC3f0DFf071D509 --deadline 1650624800
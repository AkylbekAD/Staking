import { task } from "hardhat/config";

const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // for localhost network:

task("rewardPercent", "Prints reward percent of staking")
    .setAction(async (taskArgs, hre) => {
        const StakingInterface = await hre.ethers.getContractAt("Staking", ContractAddress)
        let rewardPercent = await StakingInterface.rewardPercent()
        rewardPercent = rewardPercent.toString()
        console.log("Reward percent of staking is:",rewardPercent)
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
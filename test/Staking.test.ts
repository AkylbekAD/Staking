import chai from "chai"
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { solidity } from "ethereum-waffle"

chai.use(solidity);

describe("Staking contract", function () {
  let Staking;
  let StakingInterface: Contract;
  let owner: SignerWithAddress;
  let acc1: SignerWithAddress;
  let acc2: SignerWithAddress;

  let TestRewardToken;
  let TestRewardTokenInterface: Contract;

  let TestLPToken;
  let TestLPTokenInterface: Contract;

  beforeEach(async function() {
    TestRewardToken = await ethers.getContractFactory("TestRewardToken");   
    TestRewardTokenInterface = await TestRewardToken.deploy();
    await TestRewardTokenInterface.deployed()

    TestLPToken = await ethers.getContractFactory("TestLPToken");  
    TestLPTokenInterface = await TestLPToken.deploy();
    await TestLPTokenInterface.deployed()

    Staking = await ethers.getContractFactory("Staking");
    [owner, acc1, acc2] = await ethers.getSigners()    
    StakingInterface = await Staking.deploy(TestRewardTokenInterface.address, TestLPTokenInterface.address);
    await StakingInterface.deployed()
  });

  async function stakeLPtokens(account: SignerWithAddress, amount: number) {
    const staking = await StakingInterface.connect(account).stake(amount)
    await staking.wait()
  }

  describe("Getter public functions", function() {
    it("Should return reward percent from 'rewardPercent' getter function", async function() {
      expect(await StakingInterface.rewardPercent()).to.equal("20000")
    })

    it("Should return stake time from 'stakeTime' getter function", async function() {
        expect(await StakingInterface.stakeTime()).to.equal("1200")
      })
  })

  describe("Staking contract user functions", function() {
    beforeEach(async function () {
      const transferReward = await TestRewardTokenInterface.connect(owner).transfer(StakingInterface.address, 1000000000000)
      await transferReward.wait()

      const transferLP = await TestLPTokenInterface.connect(owner).transfer(acc1.address, 1000000000000)
      await transferLP.wait()
      const approveLP = await TestLPTokenInterface.connect(acc1).approve(StakingInterface.address, 1000000000000)
      await approveLP.wait()
    });

    describe("Stake function", function() {
      it("Stake function avaliable and transfers LP tokens to contract", async function () {
        await stakeLPtokens(acc1,1000000000000)
        const stakedTokens = await StakingInterface.stakingProviders(acc1.address)
        expect(ethers.utils.formatUnits(stakedTokens[0], 0)).to.equal("1000000000000")
      })

      it("User have to stake atleast 0.00001 of UNI-V2 token", async function () {
        expect(stakeLPtokens(acc1,99999)).to.be.revertedWith("You have to stake atleast 0.00001 of UNI-V2") // have to stake atleast 100000 LP tokens
      })
    })

    describe("Claim function", function() {
      it("Claim function avaliable when staking time passed and transfers reward tokens to provider", async function () {
        await stakeLPtokens(acc1,1000000000000)

        await ethers.provider.send("evm_increaseTime", [1200]) // pass freeze time
        await ethers.provider.send("evm_mine", [])

        await StakingInterface.connect(acc1).claim() // gets reward tokens
        const rewardTokens = await TestRewardTokenInterface.connect(acc1).balanceOf(acc1.address) //balance at TestToken contract
        expect(rewardTokens).to.equal("200000000000")
      })

      it("Claim function is not avaliable if staking time didnt pass", async function () {
        await stakeLPtokens(acc1,1000000000000)
        expect(StakingInterface.connect(acc1).claim()).to.be.revertedWith("Stake time have not pass yet")
      })
    })

    describe("Unstake function", function() {
      it("Unstake function avaliable when staking time passed and transfers LP tokens to provider", async function () {
        await stakeLPtokens(acc1,100000000000)

        await ethers.provider.send("evm_increaseTime", [1200]) // pass freeze time
        await ethers.provider.send("evm_mine", [])

        await StakingInterface.connect(acc1).unstake() // gets reward tokens
        const LPTokens = await TestLPTokenInterface.connect(acc1).balanceOf(acc1.address) //balance at TestToken contract
        expect(LPTokens).to.equal("1000000000000")
      })

      it("Unstake function is not avaliable if staking time didnt pass", async function () {
        await stakeLPtokens(acc1,1000000000000)
        expect(StakingInterface.connect(acc1).unstake()).to.be.revertedWith("Stake time have not pass yet")
      })
    })
  }) 

  describe("ADMIN and CHANGER only functions", function() {
    describe("changeStakeTime function", function() {
      it("changeStakeTime function avaliable to ADMIN and sets new stake time", async function () {
        await StakingInterface.connect(owner).changeStakeTime(600) // setting new 10 min time 
        expect(await StakingInterface.stakeTime()).to.equal("600")
      })

      it("changeStakeTime function is not avaliable to users without CHANGER access", async function () {
        expect(StakingInterface.connect(acc2).changeStakeTime(600)).to.be.revertedWith("You dont have rights to change it")
      })
    })

    describe("changeRewardPercent function", function() {
      it("changeRewardPercent function avaliable to ADMIN and sets new reward percent", async function () {
        await StakingInterface.connect(owner).changeRewardPercent(10) // setting new 10 percent reward 
        expect(await StakingInterface.rewardPercent()).to.equal("10")
      })

      it("changeRewardPercent function is not avaliable to users without CHANGER access", async function () {
        expect(StakingInterface.connect(acc2).changeRewardPercent(10)).to.be.revertedWith("You dont have rights to change it")
      })
    })

    describe("giveChangerRights function", function() {
      it("giveChangerRights function avaliable to ADMIN and gives CHANGER possibilities", async function () {
        await StakingInterface.connect(owner).giveChangerRights(acc1.address) // giving CHANGER role to acc1
        await StakingInterface.connect(acc1).changeRewardPercent(10) // setting new 10 percent reward by acc1
        expect(await StakingInterface.rewardPercent()).to.equal("10")

        await StakingInterface.connect(acc1).changeStakeTime(600) // setting new 10 min time by acc1
        expect(await StakingInterface.stakeTime()).to.equal("600")
      })

      it("changeRewardPercent function is only avaliable to ADMIN", async function () {
        expect(StakingInterface.connect(acc2).giveChangerRights(acc2.address)).to.be.revertedWith("Ownable: caller is not the owner")
      })
    })

    describe("revokeChangerRights function", function() {
      it("revokeChangerRights function avaliable to ADMIN and revokes CHANGER possibilities", async function () {
        await StakingInterface.connect(owner).giveChangerRights(acc1.address) // giving CHANGER role to acc1

        await StakingInterface.connect(acc1).changeRewardPercent(10) // setting new 10 percent reward by acc1
        expect(await StakingInterface.rewardPercent()).to.equal("10")

        await StakingInterface.connect(owner).revokeChangerRights(acc1.address) // revoke CHANGER role from acc1
        expect(StakingInterface.connect(acc1).changeRewardPercent(50)).to.be.revertedWith("You dont have rights to change it")
      })

      it("revokeChangerRights function is only avaliable to ADMIN", async function () {
        expect(StakingInterface.connect(acc2).revokeChangerRights(acc2.address)).to.be.revertedWith("Ownable: caller is not the owner")
      })
    })
  })
})

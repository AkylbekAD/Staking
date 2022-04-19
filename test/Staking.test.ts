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

  beforeEach(async function () {
      Staking = await ethers.getContractFactory("Staking");
      [owner, acc1, acc2] = await ethers.getSigners()    
      StakingInterface = await Staking.deploy();
      await StakingInterface.deployed()
  });

  describe("Getter public functions", function () {
    it("Should return reward percent from 'rewardPercent' getter function", async function () {
      expect (await StakingInterface.rewardPercent()).to.equal("20")
    })

    it("Should return stake time from 'stakeTime' getter function", async function () {
        expect (await StakingInterface.stakeTime()).to.equal("1200")
      })

  })

  describe("Stake functions", function () {
    it("Stake function", async function () {
      const stasking = await StakingInterface.connect(owner).stake(10)
      await stasking.wait();
      console.log(stasking);
    })

  }) 








})

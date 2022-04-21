import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";

import "solidity-coverage";
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"

dotenv.config();

import "./tasks/Staking.tasks"

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',]
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts:
      process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      chainId: 1337
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKET_KEY,
    currency: 'USD',
    gasPriceApi: "etherscan",
    excludeContracts: ['TestLPToken.sol', 'TestRewardToken.sol']
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: ['Staking'],
  }
};

export default config;

# Staking smart-contract project
Smart-contract on solidity for staking UNI-V2 (LP) tokens, as a reward for staking contract sends QTN tokens due settled reward percent, after staking time passes.

Alchemy - https://dashboard.alchemyapi.io/apps/wnx2r7ghi3cvrq4k

## Main contract of the project is at ```Staking.sol```

## To test there are 2 additional contracts:
TestRewardToken - ERC20 contract to send a reward tokens for staking

TestLPToken - ERC20 contract for staking LP tokens

## hardhat-contract-sizer and hardhat-gas-reporter configured
run ```npx hardhat test``` to see Gas report, coinmarketapi key required in ```.env``` file

run ```npx hardhat size-contracts``` to get size(KB) of the contract
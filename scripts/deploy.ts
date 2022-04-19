import hre from 'hardhat';
const ethers = hre.ethers;

async function main() {
    const [owner] = await ethers.getSigners()

    const Staking = await ethers.getContractFactory('Staking', owner)
    const staking = await Staking.deploy()
    await staking.deployed()
    console.log(staking.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
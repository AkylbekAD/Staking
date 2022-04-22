import hre from 'hardhat';
const ethers = hre.ethers;

const QuokkaTokenAddress = "0x04d9dfeA1b3815B62B7E105AF570A742a2Ba6334"
const UNIV2Address = "0x1e081C7ceE639CFC1955ac352fd4862751E666eD"

async function main() {
    const [owner] = await ethers.getSigners()
    const Staking = await ethers.getContractFactory('Staking', owner)
    const staking = await Staking.deploy(QuokkaTokenAddress, UNIV2Address)
    await staking.deployed()
    console.log(staking.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
import { ethers } from 'hardhat'

async function main() {
    const [deployer] = await ethers.getSigners()

    console.log('Deploying contracts with the account:', deployer.address)

    console.log('Account balance:', (await deployer.getBalance()).toString())

    const MonteQ = await ethers.getContractFactory('MonteQ')
    const monteQ = await MonteQ.deploy()

    console.log('MonteQ address:', monteQ.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

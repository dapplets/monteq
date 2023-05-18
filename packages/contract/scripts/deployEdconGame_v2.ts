import { ethers } from 'hardhat'

async function main() {
    const [deployer] = await ethers.getSigners()

    console.log('Deploying contracts with the account:', deployer.address)

    console.log('Account balance:', (await deployer.getBalance()).toString())

    if (!process.env.GAME_MASTERS) throw new Error("GAME_MASTERS env variable is empty");

    const Contract = await ethers.getContractFactory('EdconGame')
    const contract = await Contract.deploy(JSON.parse(process.env.GAME_MASTERS))

    console.log('EdconGame address:', contract.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

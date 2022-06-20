const { ethers } = require("hardhat")

const deploy = async () => {
    const [deployer] = await ethers.getSigners()
    console.log(`Deploying with account ${deployer.address}`)

    const PlatziPunks = await ethers.getContractFactory('PlatziPunks')
    const deployedContract = await PlatziPunks.deploy(10000)

    console.log(`PlatziPunks deployed in address ${deployedContract.address}`)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
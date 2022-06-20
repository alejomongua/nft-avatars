const { expect } = require('chai')

describe('PlatziPunks Contract', () => {
    const setup = async ({ maxSupply = 100 }) => {
        const [deployer] = await ethers.getSigners()

        const PlatziPunks = await ethers.getContractFactory('PlatziPunks')
        const deployedContract = await PlatziPunks.deploy(maxSupply)

        return {
            deployer,
            deployedContract
        }
    }
    describe('Deployment', () => {
        it('saves maxSupply', async () => {
            const maxSupply = 128
            const { deployedContract } = await setup({ maxSupply })

            const returnedMaxSupply = await deployedContract.maxSupply()
            expect(maxSupply).to.equal(returnedMaxSupply)
        })
    })
    describe('Minting', () => {
        it('creates a new token and assigns it to the caller address', async () => {
            const [signer] = await ethers.getSigners();
            const { deployer, deployedContract } = await setup({})

            await deployedContract.mint()
            const ownerOfMinted = await deployedContract.ownerOf(0)
            expect(ownerOfMinted).to.equal(deployer.address)
        })
        it('has a minting limit', async () => {
            const maxSupply = 4;
            const { deployer, deployedContract } = await setup({ maxSupply })

            const mintedArray = []
            for (let i = 0; i < maxSupply; i++) {
                mintedArray.push(deployedContract.mint())
            }

            await Promise.all(mintedArray)

            await expect(deployedContract.mint()).to.be.reverted
        })
    })

    describe('tokenURI', () => {
        it('returns a valid metadata', async () => {
            const { deployedContract } = await setup({})

            await deployedContract.mint()
            const tokenURI = await deployedContract.tokenURI(0)
            const stringifiedTokenURI = tokenURI.toString()
            const [_, base64JSON] = stringifiedTokenURI.split('data:application/json;base64,')
            const metadataJSON = Buffer.from(base64JSON, 'base64').toString('utf8')
            console.log(metadataJSON)
            const metadata = JSON.parse(metadataJSON)
            expect(metadata).to.have.all.keys('name', 'description', 'image')
        }).timeout(10000)
    })
})
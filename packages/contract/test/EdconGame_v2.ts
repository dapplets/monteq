import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

describe('EdconGame_v2', function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    const deployContractFixture = async () => {
        // Contracts are deployed using the first signer/account by default
        const [
            contractOwner,
            gameMaster,
            businessOwner,
            anotherAccount,
            anotherAccount2,
            anotherAccount3,
        ] = await ethers.getSigners()

        const EdconGame = await ethers.getContractFactory('contracts/EdconGame_v2.sol:EdconGame')
        const edconGame = await EdconGame.deploy([gameMaster.address])

        // TOKEN 1
        const TICKER_01 = 'TO1'
        const TOKEN_NAME_01 = 'Token 01'
        const TOKEN_ICON_01 =
            'https://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.ipfs.dweb.link/'
        const TICKER_02 = 'TO2'

        return {
            edconGame,
            gameMaster,
            businessOwner,
            anotherAccount,
            anotherAccount2,
            anotherAccount3,
            TICKER_01,
            TOKEN_NAME_01,
            TOKEN_ICON_01,
            TICKER_02,
        }
    }

    const parseReadTokenResponse = (result: any) => ({
        ticker: result.ticker,
        tokenName: result.tokenName,
        iconUrl: result.iconUrl,
        creator: result.creator,
    })

    describe('Tokens', function () {
        it('Should add a new token', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            const token = await edconGame.readToken()
            expect(token.map(parseReadTokenResponse)).to.eql([
                {
                    ticker: TICKER_01,
                    tokenName: TOKEN_NAME_01,
                    iconUrl: TOKEN_ICON_01,
                    creator: businessOwner.address,
                },
            ])
        })

        it('Should not add the existed token by the same account', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            await expect(
                edconGame
                    .connect(businessOwner)
                    .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            ).to.revertedWith('token exists already')
        })

        it('Should not add the existed token by another account without approve', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            await expect(
                edconGame
                    .connect(anotherAccount)
                    .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            ).to.revertedWith('only pre-approved creators can create token')
        })

        it('Should not add the existed token by another account with approve', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            await expect(
                edconGame.connect(gameMaster).approveCreator(anotherAccount.address, TICKER_01)
            ).to.revertedWith('token exists already')
        })

        it('Should not add a new token by approved account for another token', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
                TICKER_02,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            await expect(
                edconGame
                    .connect(businessOwner)
                    .addToken(TICKER_02, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            ).to.revertedWith('only pre-approved creators can create token')
        })
    })

    describe('Ambassadors', function () {
        it('Should add an ambassador by another ambassador without rank', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            const a = await edconGame.ambassadorRank(businessOwner.address, 0)
            expect(a).to.equal(0)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            const b = await edconGame.ambassadorRank(businessOwner.address, 0)
            expect(b).to.equal(2)
            const c = await edconGame.ambassadorRank(anotherAccount.address, 0)
            expect(c).to.equal(0)
            await edconGame
                .connect(businessOwner)
                ['setAmbassador(address,uint8)'](anotherAccount.address, 0)
            const d = await edconGame.ambassadorRank(anotherAccount.address, 0)
            expect(d).to.equal(1)
        })

        it('Should add an ambassador by another ambassador with rank', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            const a = await edconGame.ambassadorRank(businessOwner.address, 0)
            expect(a).to.equal(0)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            const b = await edconGame.ambassadorRank(businessOwner.address, 0)
            expect(b).to.equal(2)
            const c = await edconGame.ambassadorRank(anotherAccount.address, 0)
            expect(c).to.equal(0)
            await edconGame
                .connect(businessOwner)
                ['setAmbassador(address,uint8,uint8)'](anotherAccount.address, 0, 1)
            const d = await edconGame.ambassadorRank(anotherAccount.address, 0)
            expect(d).to.equal(1)
        })

        it('Should not add an ambassador by user', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            const a = await edconGame.ambassadorRank(businessOwner.address, 0)
            expect(a).to.equal(0)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            const b = await edconGame.ambassadorRank(businessOwner.address, 0)
            expect(b).to.equal(2)
            await expect(
                edconGame
                    .connect(anotherAccount)
                    ['setAmbassador(address,uint8,uint8)'](businessOwner.address, 0, 1)
            ).to.revertedWith('only Project Ambassador is eligible to mint tokens') // ToDo: change message
        })
    })

    describe('Transfers', function () {
        it('Should transfer one type tokens from ambassador to user', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)

            await edconGame.connect(businessOwner).transfer(0, 9, anotherAccount.address)

            expect(await edconGame.box(businessOwner.address, 0)).to.equal(0)
            expect(await edconGame.box(anotherAccount.address, 0)).to.equal(9)
        })

        it('Should transfer one type tokens from user to user', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                anotherAccount2,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)

            await edconGame.connect(businessOwner).transfer(0, 9, anotherAccount.address)
            await edconGame.connect(anotherAccount).transfer(0, 6, anotherAccount2.address)

            expect(await edconGame.box(businessOwner.address, 0)).to.equal(0)
            expect(await edconGame.box(anotherAccount.address, 0)).to.equal(3)
            expect(await edconGame.box(anotherAccount2.address, 0)).to.equal(6)
        })

        it('Should transfer different tokens from ambassador to user', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                anotherAccount2,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
                TICKER_02,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            await edconGame.connect(gameMaster).approveCreator(anotherAccount.address, TICKER_02)
            await edconGame
                .connect(anotherAccount)
                .addToken(TICKER_02, TOKEN_NAME_01, TOKEN_ICON_01, 2)

            await edconGame.connect(businessOwner).transfer(0, 9, anotherAccount.address)
            await edconGame
                .connect(anotherAccount)
                .transferBatch([0, 1], [6, 10], anotherAccount2.address)

            expect(await edconGame.box(businessOwner.address, 0)).to.equal(0)
            expect(await edconGame.box(anotherAccount.address, 0)).to.equal(3)
            expect(await edconGame.box(anotherAccount2.address, 0)).to.equal(6)

            expect(await edconGame.box(businessOwner.address, 1)).to.equal(0)
            expect(await edconGame.box(anotherAccount.address, 1)).to.equal(0)
            expect(await edconGame.box(anotherAccount2.address, 1)).to.equal(10)
        })

        it('Should transfer different tokens from user to user', async () => {
            const {
                edconGame,
                gameMaster,
                businessOwner,
                anotherAccount,
                anotherAccount2,
                anotherAccount3,
                TICKER_01,
                TOKEN_NAME_01,
                TOKEN_ICON_01,
                TICKER_02,
            } = await loadFixture(deployContractFixture)
            await edconGame.connect(gameMaster).approveCreator(businessOwner.address, TICKER_01)
            await edconGame
                .connect(businessOwner)
                .addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            await edconGame.connect(gameMaster).approveCreator(anotherAccount.address, TICKER_02)
            await edconGame
                .connect(anotherAccount)
                .addToken(TICKER_02, TOKEN_NAME_01, TOKEN_ICON_01, 2)

            await edconGame.connect(businessOwner).transfer(0, 7, anotherAccount2.address)
            await edconGame.connect(anotherAccount).transfer(1, 15, anotherAccount2.address)
            expect(await edconGame.box(anotherAccount2.address, 0)).to.equal(7)
            expect(await edconGame.box(anotherAccount2.address, 1)).to.equal(15)

            await edconGame
                .connect(anotherAccount2)
                .transferBatch([0, 1], [7, 10], anotherAccount3.address)

            expect(await edconGame.box(businessOwner.address, 0)).to.equal(0)
            expect(await edconGame.box(anotherAccount.address, 0)).to.equal(0)
            expect(await edconGame.box(anotherAccount2.address, 0)).to.equal(0)
            expect(await edconGame.box(anotherAccount3.address, 0)).to.equal(7)

            expect(await edconGame.box(businessOwner.address, 1)).to.equal(0)
            expect(await edconGame.box(anotherAccount.address, 1)).to.equal(0)
            expect(await edconGame.box(anotherAccount2.address, 1)).to.equal(5)
            expect(await edconGame.box(anotherAccount3.address, 1)).to.equal(10)
        })
    })

    // describe('Locktime', function () {
    //     it('Should transfer tokens of different types from user to user during recipients locktime', async () => {
    //         const { edconGame } = await loadFixture(deployOneYearLockFixture)
    //         expect(false).to.eql(true)
    //     })

    //     it('Should transfer tokens of one type from ambassador to user during recipients locktime', async () => {
    //         const { edconGame } = await loadFixture(deployOneYearLockFixture)
    //         expect(false).to.eql(true)
    //     })

    //     it('Should not transfer tokens of one type from user to user during recipients locktime', async () => {
    //         const { edconGame } = await loadFixture(deployOneYearLockFixture)
    //         expect(true).to.throw("You aren't the ambassador")
    //     })
    // })
})

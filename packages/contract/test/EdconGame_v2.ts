import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

describe('EdconGame_v2', function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners()

        const EdconGame = await ethers.getContractFactory('contracts/EdconGame_v2.sol:EdconGame')
        const edconGame = await EdconGame.deploy()

        // TOKEN 1
        const TICKER_01 = 'TO1'
        const TOKEN_NAME_01 = 'Token 01'
        const TOKEN_ICON_01 =
            'https://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi.ipfs.dweb.link/'

        return {
            edconGame,
            owner,
            otherAccount,
            TICKER_01,
            TOKEN_NAME_01,
            TOKEN_ICON_01,
        }
    }

    const parseReadTokenResponse = (result: any) => ({
        ticker: result.ticker,
        tokenName: result.tokenName,
        iconUrl: result.iconUrl,
        creator: result.creator,
    })

    describe('Add tokens and set ambassadors', function () {
        it('Should add a new token', async () => {
            const { edconGame, owner, TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01 } = await loadFixture(
                deployOneYearLockFixture
            )
            await edconGame.addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            const token = await edconGame.readToken()
            expect(token.map(parseReadTokenResponse)).to.eql([
                {
                    ticker: TICKER_01,
                    tokenName: TOKEN_NAME_01,
                    iconUrl: TOKEN_ICON_01,
                    creator: owner.address,
                },
            ])
        })

        it('Should not add the existed token', async () => {
            const { edconGame, owner, otherAccount, TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01 } =
                await loadFixture(deployOneYearLockFixture)
            await edconGame.addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            await expect(
                edconGame.addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            ).to.revertedWith('token exists already')
        })

        it('Should add an ambassador by another ambassador without rank', async () => {
            const { edconGame, owner, otherAccount, TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01 } =
                await loadFixture(deployOneYearLockFixture)
            const a = await edconGame.ambassadorRank(owner.address, 0)
            expect(a).to.equal(0)
            await edconGame.addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            const b = await edconGame.ambassadorRank(owner.address, 0)
            expect(b).to.equal(2)
            const c = await edconGame.ambassadorRank(otherAccount.address, 0)
            expect(c).to.equal(0)
            await edconGame['setAmbassador(address,uint8)'](otherAccount.address, 0)
            const d = await edconGame.ambassadorRank(otherAccount.address, 0)
            expect(d).to.equal(1)
        })

        it('Should add an ambassador by another ambassador with rank', async () => {
            const { edconGame, owner, otherAccount, TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01 } =
                await loadFixture(deployOneYearLockFixture)
            const a = await edconGame.ambassadorRank(owner.address, 0)
            expect(a).to.equal(0)
            await edconGame.addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            const b = await edconGame.ambassadorRank(owner.address, 0)
            expect(b).to.equal(2)
            const c = await edconGame.ambassadorRank(otherAccount.address, 0)
            expect(c).to.equal(0)
            await edconGame['setAmbassador(address,uint8,uint8)'](otherAccount.address, 0, 1)
            const d = await edconGame.ambassadorRank(otherAccount.address, 0)
            expect(d).to.equal(1)
        })

        it('Should not add an ambassador by user', async () => {
            const { edconGame, owner, otherAccount, TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01 } =
                await loadFixture(deployOneYearLockFixture)
            const a = await edconGame.ambassadorRank(owner.address, 0)
            expect(a).to.equal(0)
            await edconGame.addToken(TICKER_01, TOKEN_NAME_01, TOKEN_ICON_01, 2)
            const b = await edconGame.ambassadorRank(owner.address, 0)
            expect(b).to.equal(2)
            await expect(
                edconGame
                    .connect(otherAccount)
                    ['setAmbassador(address,uint8,uint8)'](owner.address, 0, 1)
            ).to.revertedWith('only Project Ambassador is eligible to mint tokens') // ToDo: change message
        })
    })

    // describe('Transfers', function () {
    //     it('Should transfer same tokens from ambassador to user', async () => {
    //         const { edconGame, owner } = await loadFixture(deployOneYearLockFixture)
    //         expect(false).to.eql(true)
    //     })

    //     it('Should transfer same tokens from user to user', async () => {
    //         const { edconGame, owner } = await loadFixture(deployOneYearLockFixture)
    //         expect(false).to.eql(true)
    //     })

    //     it('Should transfer different tokens from user to user', async () => {
    //         const { edconGame, owner } = await loadFixture(deployOneYearLockFixture)
    //         expect(false).to.eql(true)
    //     })

    //     it('Should not transfer different tokens from ambassador to user', async () => {
    //         const { edconGame, owner } = await loadFixture(deployOneYearLockFixture)
    //         expect(true).to.throw('You are the ambassador!')
    //     })
    // })

    // describe('Locktime', function () {
    //     it('Should transfer tokens of different types from user to user during recipients locktime', async () => {
    //         const { edconGame, owner } = await loadFixture(deployOneYearLockFixture)
    //         expect(false).to.eql(true)
    //     })

    //     it('Should transfer tokens of one type from ambassador to user during recipients locktime', async () => {
    //         const { edconGame, owner } = await loadFixture(deployOneYearLockFixture)
    //         expect(false).to.eql(true)
    //     })

    //     it('Should not transfer tokens of one type from user to user during recipients locktime', async () => {
    //         const { edconGame, owner } = await loadFixture(deployOneYearLockFixture)
    //         expect(true).to.throw("You aren't the ambassador")
    //     })
    // })
})

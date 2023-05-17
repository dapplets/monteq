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
        const emptyBusinessInfo = ['', '0x0000000000000000000000000000000000000000', '']

        const businessId001 = 'some-business-id-001'
        const businessName001 = 'Some Business 001'

        const businessId002 = 'some-business-id-002'
        const businessName002 = 'Some Business 002'

        const businessId003 = 'some-business-id-003'
        const businessName003 = 'Some Business 003'

        const currencyAmount001 = '171'
        const amountReceipt001 = '1000000000000000'
        const amountTip001 = '100000000000000'
        const amountSum001 = '1100000000000000'

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners()
        const businessInfo001 = [businessId001, owner.address, businessName001]
        const businessInfo002 = [businessId002, otherAccount.address, businessName002]

        const EdconGame = await ethers.getContractFactory('contracts/EdconGame_v2.sol:EdconGame')
        const edconGame = await EdconGame.deploy()

        return {
            edconGame,
            owner,
            otherAccount,
            businessId001,
            businessName001,
            businessId002,
            businessName002,
            businessId003,
            businessName003,
            businessInfo001,
            businessInfo002,
            currencyAmount001,
            emptyBusinessInfo,
            amountReceipt001,
            amountTip001,
            amountSum001,
        }
    }

    describe('Minting', function () {
        it('Should add an ambassador and mint tokens', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(false).to.eql(true)
        })

        it('Should not mint tokens by user', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(true).to.throw('You are not an ambassador')
        })
    })

    describe('Transfers', function () {
        it('Should transfer same tokens from ambassador to user', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(false).to.eql(true)
        })

        it('Should transfer same tokens from user to user', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(false).to.eql(true)
        })

        it('Should transfer different tokens from user to user', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(false).to.eql(true)
        })

        it('Should not transfer different tokens from ambassador to user', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(true).to.throw('You are the ambassador!')
        })
    })

    describe('Locktime', function () {
        it('Should transfer tokens of different types from user to user during recipients locktime', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(false).to.eql(true)
        })

        it('Should transfer tokens of one type from ambassador to user during recipients locktime', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(false).to.eql(true)
        })

        it('Should not transfer tokens of one type from user to user during recipients locktime', async () => {
            const { edconGame, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(true).to.throw("You aren't the ambassador")
        })
    })
})

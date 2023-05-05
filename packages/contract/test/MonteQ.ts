import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

describe('MonteQ', function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {
        const emptyBusinessInfo = ['0x0000000000000000000000000000000000000000', '']

        const businessId001 = 'some-business-id-001'
        const businessName001 = 'Some Business 001'

        const businessId002 = 'some-business-id-002'
        const businessName002 = 'Some Business 002'

        const currencyAmount001 = '171'
        const amountReceipt001 = '1000000000000000'
        const amountTip001 = '1000000000000'
        const amountSum001 = '1100000000000000'

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners()
        const businessInfo001 = [owner.address, businessName001]
        const businessInfo002 = [otherAccount.address, businessName002]

        const MonteQ = await ethers.getContractFactory('MonteQ')
        const monteQ = await MonteQ.deploy()

        return {
            monteQ,
            owner,
            otherAccount,
            businessId001,
            businessName001,
            businessId002,
            businessName002,
            businessInfo001,
            businessInfo002,
            currencyAmount001,
            emptyBusinessInfo,
            amountReceipt001,
            amountTip001,
            amountSum001,
        }
    }

    describe('Accounts management', function () {
        it("should return null if the owner wasn't attached", async function () {
            const { monteQ, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            const [owner, name] = await monteQ.businessInfos(businessId001)
            expect([owner, name]).to.eql(emptyBusinessInfo)
        })

        it('should attach the owner', async function () {
            const { monteQ, businessId001, businessName001, businessInfo001 } = await loadFixture(
                deployOneYearLockFixture
            )
            await monteQ.addBusiness(businessId001, businessName001)
            const [receivedOwner, name] = await monteQ.businessInfos(businessId001)
            expect([receivedOwner, name]).to.eql(businessInfo001)
        })

        it('should remove the owner', async function () {
            const { monteQ, businessId001, businessName001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            await monteQ.addBusiness(businessId001, businessName001)
            await monteQ.removeBusiness(businessId001)
            const [receivedOwner, name] = await monteQ.businessInfos(businessId001)
            expect([receivedOwner, name]).to.eql(emptyBusinessInfo)
        })
    })

    describe('Test transfers', function () {
        it('should pay the check with tips to nonexisted account', async function () {
            const {
                monteQ,
                otherAccount,
                businessId002,
                businessName002,
                amountReceipt001,
                amountSum001,
                currencyAmount001,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountSum001,
            })
            const balanceBefore = await otherAccount.getBalance()
            const tx = await monteQ
                .connect(otherAccount)
                .addBusiness(businessId002, businessName002)
            const receipt = await tx.wait()
            const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
            const balanceAfter = await otherAccount.getBalance()
            const sub = balanceAfter.sub(balanceBefore)
            expect(sub).to.eql(BigNumber.from(amountSum001).sub(gasUsed))
        })

        it('should pay the check with tips to existed account', async function () {
            const {
                monteQ,
                otherAccount,
                businessId002,
                businessName002,
                amountReceipt001,
                amountSum001,
                currencyAmount001,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.connect(otherAccount).addBusiness(businessId002, businessName002)
            const balanceBefore = await otherAccount.getBalance()
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountSum001,
            })
            const balanceAfter = await otherAccount.getBalance()
            const sub = balanceAfter.sub(balanceBefore)
            expect(sub.toString()).to.equal(amountSum001)
        })

        it('should pay the check without tips to nonexisted account', async function () {
            const {
                monteQ,
                otherAccount,
                businessId002,
                businessName002,
                amountReceipt001,
                currencyAmount001,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountReceipt001,
            })
            const balanceBefore = await otherAccount.getBalance()
            const tx = await monteQ
                .connect(otherAccount)
                .addBusiness(businessId002, businessName002)
            const receipt = await tx.wait()
            const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
            const balanceAfter = await otherAccount.getBalance()
            const sub = balanceAfter.sub(balanceBefore)
            expect(sub).to.eql(BigNumber.from(amountReceipt001).sub(gasUsed))
        })

        it('should pay the check without tips to existed account', async function () {
            const {
                monteQ,
                otherAccount,
                businessId002,
                businessName002,
                amountReceipt001,
                currencyAmount001,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.connect(otherAccount).addBusiness(businessId002, businessName002)
            const balanceBefore = await otherAccount.getBalance()
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountReceipt001,
            })
            const balanceAfter = await otherAccount.getBalance()
            const sub = balanceAfter.sub(balanceBefore)
            expect(sub.toString()).to.equal(amountReceipt001)
        })
    })

    describe('History changes', function () {
        // getHistoryData does not return timestamps for ease of comparing objects. To get timestamps, use a separate function.
        const getHistoryData = (data: any) => {
            return {
                businessId: data.businessId,
                payer: data.payer,
                currencyReceipt: data.currencyReceipt.toString(),
                receiptAmount: data.receiptAmount.toString(),
                tipAmount: data.tipAmount.toString(),
            }
        }
        const getHistoryTimestamp = (data: any): number => +data.timestamp.toString() // amount of SECONDS!!! since January 1, 1970

        it('should pay the check without tips to existed account and get history by payer and business', async function () {
            const {
                monteQ,
                owner,
                otherAccount,
                businessId002,
                businessName002,
                amountReceipt001,
                currencyAmount001,
            } = await loadFixture(deployOneYearLockFixture)
            const currentTimeInSeconds = Math.round(new Date().valueOf() / 1000)
            await monteQ.connect(otherAccount).addBusiness(businessId002, businessName002)
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountReceipt001,
            })

            const responseHistoryByPayer = await monteQ.getHistoryByPayer(
                owner.address,
                0,
                10,
                false
            )
            const historyByPayer = responseHistoryByPayer[0].map(getHistoryData)
            expect(historyByPayer).to.eql([
                {
                    businessId: businessId002,
                    payer: owner.address,
                    currencyReceipt: currencyAmount001,
                    receiptAmount: amountReceipt001,
                    tipAmount: '0',
                },
            ])
            const historyByPayerTimestamps = responseHistoryByPayer[0].map(getHistoryTimestamp)
            expect(
                historyByPayerTimestamps[0] > currentTimeInSeconds - 10 &&
                    historyByPayerTimestamps[0] < currentTimeInSeconds + 10
            ).to.equal(true)

            const responseHistoryByBusiness = await monteQ.getHistoryByBusiness(
                businessId002,
                0,
                10,
                false
            )
            const historyByBusiness = responseHistoryByBusiness[0].map(getHistoryData)
            expect(historyByBusiness).to.eql([
                {
                    businessId: businessId002,
                    payer: owner.address,
                    currencyReceipt: currencyAmount001,
                    receiptAmount: amountReceipt001,
                    tipAmount: '0',
                },
            ])
            const historyByBusinessTimestamps =
                responseHistoryByBusiness[0].map(getHistoryTimestamp)
            expect(historyByBusinessTimestamps[0]).to.equal(historyByPayerTimestamps[0])
        })
    })
})

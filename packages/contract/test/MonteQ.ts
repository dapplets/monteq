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

    describe('Accounts management', function () {
        const parseBusinessInfos = (response: any) =>
            response.map((data: any) => ({ id: data.id, owner: data.owner, name: data.name }))

        it("should return null if the owner wasn't attached", async function () {
            const { monteQ, owner, businessId001, emptyBusinessInfo } = await loadFixture(
                deployOneYearLockFixture
            )
            const businessInfosById = await monteQ.businessInfos(businessId001)
            expect([businessInfosById.id, businessInfosById.owner, businessInfosById.name]).to.eql(
                emptyBusinessInfo
            )
            const response = await monteQ.getBusinessInfosByOwer(owner.address)
            expect(parseBusinessInfos(response)).to.eql([])
        })

        it('should attach the owner', async function () {
            const {
                monteQ,
                owner,
                businessId001,
                businessName001,
                businessInfo001,
                businessId002,
                emptyBusinessInfo,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.addBusiness(businessId001, businessName001)
            const [id, receivedOwner, name] = await monteQ.businessInfos(businessId001)
            expect([id, receivedOwner, name]).to.eql(businessInfo001)
            const response = await monteQ.getBusinessInfosByOwer(owner.address)
            expect(parseBusinessInfos(response)).to.eql([
                {
                    id: businessId001,
                    owner: owner.address,
                    name: businessName001,
                },
            ])
            const res2 = await monteQ.businessInfos(businessId002)
            expect([res2.id, res2.owner, res2.name]).to.eql(emptyBusinessInfo)
        })

        it('should remove the owner', async function () {
            const { monteQ, owner, businessId001, businessName001, emptyBusinessInfo } =
                await loadFixture(deployOneYearLockFixture)
            await monteQ.addBusiness(businessId001, businessName001)
            await monteQ.removeBusiness(businessId001)
            const [id, receivedOwner, name] = await monteQ.businessInfos(businessId001)
            expect([id, receivedOwner, name]).to.eql(emptyBusinessInfo)
            const response = await monteQ.getBusinessInfosByOwer(owner.address)
            expect(parseBusinessInfos(response)).to.eql([])
        })

        it('should get the businesses by the owner', async function () {
            const {
                owner,
                monteQ,
                businessId001,
                businessName001,
                businessId002,
                businessName002,
                businessId003,
                businessName003,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.addBusiness(businessId001, businessName001)
            await monteQ.addBusiness(businessId002, businessName002)
            await monteQ.addBusiness(businessId003, businessName003)
            const result = await monteQ.getBusinessInfosByOwer(owner.address)
            expect(parseBusinessInfos(result)).to.eql([
                { id: businessId001, owner: owner.address, name: businessName001 },
                { id: businessId002, owner: owner.address, name: businessName002 },
                { id: businessId003, owner: owner.address, name: businessName003 },
            ])
        })

        it('should get the businesses by the owner after removing the first item', async function () {
            const {
                owner,
                monteQ,
                businessId001,
                businessName001,
                businessId002,
                businessName002,
                businessId003,
                businessName003,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.addBusiness(businessId001, businessName001)
            await monteQ.addBusiness(businessId002, businessName002)
            await monteQ.addBusiness(businessId003, businessName003)
            await monteQ.removeBusiness(businessId001)
            const result = await monteQ.getBusinessInfosByOwer(owner.address)
            expect(parseBusinessInfos(result)).to.eql([
                { id: businessId003, owner: owner.address, name: businessName003 },
                { id: businessId002, owner: owner.address, name: businessName002 },
            ])
        })

        it('should get the businesses by the owner after removing the last item', async function () {
            const {
                owner,
                monteQ,
                businessId001,
                businessName001,
                businessId002,
                businessName002,
                businessId003,
                businessName003,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.addBusiness(businessId001, businessName001)
            await monteQ.addBusiness(businessId002, businessName002)
            await monteQ.addBusiness(businessId003, businessName003)
            await monteQ.removeBusiness(businessId003)
            const result = await monteQ.getBusinessInfosByOwer(owner.address)
            expect(parseBusinessInfos(result)).to.eql([
                { id: businessId001, owner: owner.address, name: businessName001 },
                { id: businessId002, owner: owner.address, name: businessName002 },
            ])
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

        it('should pay several times', async function () {
            const {
                monteQ,
                otherAccount,
                businessId002,
                businessName002,
                amountReceipt001,
                currencyAmount001,
                amountSum001,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountReceipt001,
            })
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountSum001,
            })
            const balanceBefore = await otherAccount.getBalance()
            const tx = await monteQ
                .connect(otherAccount)
                .addBusiness(businessId002, businessName002)
            const receipt = await tx.wait()
            const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice)
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountSum001,
            })
            const balanceAfter = await otherAccount.getBalance()
            const sub = balanceAfter.sub(balanceBefore).add(gasUsed)
            expect(sub).to.eql(BigNumber.from('3200000000000000'))
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
            await monteQ.connect(otherAccount).addBusiness(businessId002, businessName002)
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountReceipt001,
            })
            const timestamp = await time.latest()

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
            expect(historyByPayerTimestamps[0]).to.be.equal(+timestamp.toString())

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

        it('should pay the check with tips to nonexisted account and get history by payer and business', async function () {
            const {
                monteQ,
                owner,
                businessId002,
                amountReceipt001,
                amountTip001,
                currencyAmount001,
                amountSum001,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.payReceipt(businessId002, currencyAmount001, amountReceipt001, {
                value: amountSum001,
            })
            const timestamp = await time.latest()

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
                    tipAmount: amountTip001,
                },
            ])
            const historyByPayerTimestamps = responseHistoryByPayer[0].map(getHistoryTimestamp)
            expect(historyByPayerTimestamps[0]).to.be.equal(+timestamp.toString())

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
                    tipAmount: amountTip001,
                },
            ])
            const historyByBusinessTimestamps =
                responseHistoryByBusiness[0].map(getHistoryTimestamp)
            expect(historyByBusinessTimestamps[0]).to.equal(historyByPayerTimestamps[0])
        })
    })
})

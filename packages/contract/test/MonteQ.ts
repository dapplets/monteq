import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'

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

        const currencyType001 = 'EUR'
        const currencyAmount001 = '171'
        const currencyTip001 = '17'
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
            currencyType001,
            currencyAmount001,
            currencyTip001,
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
            console.log('result', [owner, name])
            expect([owner, name]).to.eql(emptyBusinessInfo)
        })

        it('should attach the owner', async function () {
            const { monteQ, owner, businessId001, businessName001, businessInfo001 } =
                await loadFixture(deployOneYearLockFixture)
            await monteQ.addBusiness(businessId001, owner.address, businessName001)
            const [receivedOwner, name] = await monteQ.businessInfos(businessId001)
            console.log('result', [receivedOwner, name])
            expect([receivedOwner, name]).to.eql(businessInfo001)
        })

        it('should remove the owner', async function () {
            const { monteQ, owner, businessId001, businessName001, emptyBusinessInfo } =
                await loadFixture(deployOneYearLockFixture)
            await monteQ.addBusiness(businessId001, owner.address, businessName001)
            await monteQ.removeBusiness(businessId001)
            const [receivedOwner, name] = await monteQ.businessInfos(businessId001)
            console.log('result', [receivedOwner, name])
            expect([receivedOwner, name]).to.eql(emptyBusinessInfo)
        })

        it('should pay the check without tips to nonexisted account', async function () {
            const {
                monteQ,
                otherAccount,
                businessId002,
                businessName002,
                amountReceipt001,
                amountSum001,
                currencyType001,
                currencyAmount001,
                currencyTip001,
                businessInfo002,
            } = await loadFixture(deployOneYearLockFixture)
            await monteQ.payReceipt(
                businessId002,
                currencyType001,
                currencyAmount001,
                currencyTip001,
                amountReceipt001,
                { value: amountSum001 }
            )
            const balanceBefore = await otherAccount.getBalance()
            console.log('balance before', balanceBefore)
            await monteQ.addBusiness(businessId002, otherAccount.address, businessName002)
            const balanceAfter = await otherAccount.getBalance()
            console.log('balance after', balanceAfter)
            const sub = balanceAfter.sub(balanceBefore)
            console.log('sub', sub)
            const [receivedOwner, name] = await monteQ.businessInfos(businessId002)
            console.log('result', [receivedOwner, name])
            expect([receivedOwner, name]).to.eql(businessInfo002)
            expect(sub.toString()).to.eql(amountSum001)
        })

        // it('should pay the check with tips to nonexisted account', async function () {
        //     const { monteQ, owner, businessId001, businessName001, amountReceipt001, amountTip001 } =
        //         await loadFixture(deployOneYearLockFixture)
        //     await monteQ.payReceipt(businessId001, ETH001, ETH000001)
        //     console.log('balance before', await owner.getBalance())
        //     await monteQ.attachOwner(businessId001, owner.address, businessName001)
        //     const result = await monteQ.businessInfos(businessId001)
        //     console.log('balance after', await owner.getBalance())
        //     expect(result).to.equal(owner.address)
        // })
    })

    // describe("Withdrawals", function () {
    //   describe("Validations", function () {
    //     it("Should revert with the right error if called too soon", async function () {
    //       const { lock } = await loadFixture(deployOneYearLockFixture);

    //       await expect(lock.withdraw()).to.be.revertedWith(
    //         "You can't withdraw yet"
    //       );
    //     });

    //     it("Should revert with the right error if called from another account", async function () {
    //       const { lock, unlockTime, otherAccount } = await loadFixture(
    //         deployOneYearLockFixture
    //       );

    //       // We can increase the time in Hardhat Network
    //       await time.increaseTo(unlockTime);

    //       // We use lock.connect() to send a transaction from another account
    //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //         "You aren't the owner"
    //       );
    //     });

    //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //       const { lock, unlockTime } = await loadFixture(
    //         deployOneYearLockFixture
    //       );

    //       // Transactions are sent using the first signer by default
    //       await time.increaseTo(unlockTime);

    //       await expect(lock.withdraw()).not.to.be.reverted;
    //     });
    //   });

    //   describe("Events", function () {
    //     it("Should emit an event on withdrawals", async function () {
    //       const { lock, unlockTime, lockedAmount } = await loadFixture(
    //         deployOneYearLockFixture
    //       );

    //       await time.increaseTo(unlockTime);

    //       await expect(lock.withdraw())
    //         .to.emit(lock, "Withdrawal")
    //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //     });
    //   });

    //   describe("Transfers", function () {
    //     it("Should transfer the funds to the owner", async function () {
    //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
    //         deployOneYearLockFixture
    //       );

    //       await time.increaseTo(unlockTime);

    //       await expect(lock.withdraw()).to.changeEtherBalances(
    //         [owner, lock],
    //         [lockedAmount, -lockedAmount]
    //       );
    //     });
    //   });
    // });
})

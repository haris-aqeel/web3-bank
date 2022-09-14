const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");


// describe
// beforeEach
// it
// Assert | Expect

describe("Bank", async function () {
    let deployer, bank, fundAmount;

    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture([process.env.SMART_CONTRACT_NAME]);
        bank = await ethers.getContract(process.env.SMART_CONTRACT_NAME, deployer);
        fundAmount = ethers.utils.parseEther("1");
    });

    describe("constructor", async function () {
        it("should set the owner correctly", async function () {
            const contractOwnerAddress = await bank.owner();
            assert.equal(contractOwnerAddress, deployer);
        });
    });

    describe("deposit", async function() {
        it("should fail for amount less than minimum", async function () {
            let minimum_value = 0;
            await expect(bank.deposit({value: minimum_value})).to.be.reverted;
        });
        it("updates the balance of depositter after funded", async function () {
            await bank.deposit({ value: fundAmount });
            const balanceOfSender = await bank.getFunderBalance(deployer)
            assert.equal(fundAmount, balanceOfSender.toString());
        })
        it("should add the address of funder in the array", async function () {
            await bank.deposit({ value: fundAmount });
            const address = await bank.getFundersAddress(0);
            assert.equal(address, deployer);
        })
    })


    describe("Withdraw", async function () {
        beforeEach("Fund Contract before withdraw", async function () {
            await bank.deposit({ value: fundAmount });
        });

        it("withdraw fund from a single founder", async function () {
            // Arrange
            const initialContractBalance = await bank.getContractBalance();
            const initialDeployerBalance = await bank.provider.getBalance(deployer);

            // Act
            const transaction = await bank.withdraw();
            const transactionReciept = await transaction.wait(1);
            const {effectiveGasPrice, gasUsed} = transactionReciept;
            const gasCost = effectiveGasPrice.mul(gasUsed);
            const finalContractBalance = await bank.getContractBalance();
            const finalDeployerBalance = await bank.provider.getBalance(deployer);

            // Assert
            assert.equal(finalContractBalance.toString(), '0');
            assert.equal(
                initialDeployerBalance.add(initialContractBalance).toString(), 
                finalDeployerBalance.add(gasCost).toString()
                );
        })

        it ("withdraw funds from multiple funders", async function() {
            // Let's do it with ethers
            //  Arrange
            const accounts = await ethers.getSigners();
            for (i = 1; i < 6; i++){
               const bankConnectedAccount =  await bank.connect(accounts[i])
               await bankConnectedAccount.deposit({ value: fundAmount });
            }

            const initialContractBalance = await bank.getContractBalance();
            const initialDeployerBalance = await bank.provider.getBalance(deployer);

            // Act
            const transaction = await bank.withdraw();
            const transactionReciept = await transaction.wait(1);
            const {effectiveGasPrice, gasUsed} = transactionReciept;
            const gasCost = effectiveGasPrice.mul(gasUsed);
            // Assert
            const finalContractBalance = await bank.getContractBalance();
            const finalDeployerBalance = await bank.provider.getBalance(deployer);


            assert.equal(finalContractBalance.toString(), '0');
            assert.equal(
                initialDeployerBalance.add(initialContractBalance).toString(), 
                finalDeployerBalance.add(gasCost).toString()
                );

            // Making sure that the funders array is empty
            // await expect(bank.getFunderBalance(0)).to.be.reverted;
            for (i = 1; i < 6; i++){
                assert.equal(await bank.getFunderBalance(accounts[i].address), '0');
            }
        })

        it ("don't allow other than owner to withdraw", async function() {
            const accounts = await ethers.getSigners();
            const bankConnectedAccount =  await bank.connect(accounts[1]);
            expect(bankConnectedAccount.withdraw()).to.be.revertedWithCustomError(bank, "Bank__NotOwner");

        })



    })
})
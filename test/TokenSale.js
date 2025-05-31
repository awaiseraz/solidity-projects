const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenSale Contract", function () {
    let Token, token;
    let Sale, sale;
    let owner, addr1, addr2;
    const tokenPrice = ethers.utils.parseUnits("0.001", "ether");
    const initialSupply = 1000;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("VendingToken", "VT", initialSupply);
        await token.deployed();
        Sale = await ethers.getContractFactory("TokenSale");
        sale = await Sale.deploy(token.address, tokenPrice);
        await sale.deployed();
    });

    it("should set the right owner", async function () {
        expect(await sale.owner()).to.equal(owner.address);
    });

    it("should have the correct token address and price", async function () {
        expect(await sale.token()).to.equal(token.address);
        expect(await sale.tokenPrice()).to.equal(tokenPrice);
    });

    it("should allow buy tokens with ETH", async function () {
        const ethAmount = ethers.utils.parseUnits("0.1", "ether");
        const expectedTokens = ethAmount.div(tokenPrice);
        await token.connect(owner).transfer(sale.address, 500 * 10 * 18);

        await sale.connect(addr1).buyTokens({ value: ethAmount });
        expect(await token.connect(addr1).balanceOf(addr1.address)).to.equal(expectedTokens);
    });

    it("should emit TokenPurchased event when buying tokens", async function () {
        const ethAmount = ethers.utils.parseUnits("0.1", "ether");
        const expectedTokens = ethAmount.div(tokenPrice);
        await token.connect(owner).transfer(sale.address, 500 * 10 * 18);
        await expect(sale.connect(addr1).buyTokens({ value: ethAmount })).to.emit(sale, "TokenPurchased").withArgs(addr1.address, expectedTokens, tokenPrice);
    });

    it("should fail if not enough ETH to sent to buy at least 1 token", async function () {
        const smallAmount = ethers.utils.parseUnits("0.0009", "ether");
        await expect(sale.connect(addr1).buyTokens({ value: smallAmount })).to.be.revertedWith("Not enough ETH for even 1 token");
    });

    it("should allow owner to withdraw ETH", async function () {
        const ethAmount = ethers.utils.parseUnits("0.1", "ether");
        //const expectedTokens = ethAmount.div(tokenPrice);
        await token.connect(owner).transfer(sale.address, 500 * 10 * 18);
        await sale.connect(addr1).buyTokens({ value: ethAmount });
        expect(await ethers.provider.getBalance(sale.address)).to.equal(ethAmount);
        await expect(() =>
            sale.connect(owner).withdraw()).to.changeEtherBalance(owner, ethAmount);
        expect(await ethers.provider.getBalance(sale.address)).to.equal(0);
    });

    it("should not allow non-owners to withdrwa tokens", async function () {
        const ethAmount = ethers.utils.parseUnits("0.1", "ether");
        //const expectedTokens = ethAmount.div(tokenPrice);
        await token.connect(owner).transfer(sale.address, 500 * 10 * 18);
        await sale.connect(addr1).buyTokens({ value: ethAmount });
        await expect(sale.connect(addr1).withdraw()).to.be.revertedWith("You are not the owner");
    });

    it("should update token price only by owner", async function () {
        const newPrice = ethers.utils.parseUnits("0.002", "ether");
        await sale.connect(owner).setTokenPrice(newPrice);
        expect(await sale.tokenPrice()).to.equal(newPrice);
    });

    it("should not allow non-owners to update token", async function () {
        const newPrice = ethers.utils.parseUnits("0.002", "ether");
        await expect(sale.connect(addr1).setTokenPrice(newPrice)).to.be.revertedWith("You are not the owner");
        expect(await sale.tokenPrice()).to.equal(tokenPrice);
    });

    it("should reject invalid token price (0)", async function () {
        const newPrice = ethers.utils.parseUnits("0", "ether");
        await expect(sale.connect(owner).setTokenPrice(newPrice)).to.be.revertedWith("enter the correct amount");
    });

    it("should handle fallback (receive) function correctly", async function () {
        const ethAmount = ethers.utils.parseUnits("0.1", "ether");
        const negativeEthAmount = ethAmount.mul(-1).toString();
        const expectedTokens = ethAmount.div(tokenPrice);
        await token.connect(owner).transfer(sale.address, 500 * 10 * 18);
        await expect(() =>
            addr1.sendTransaction({
                to: sale.address,
                value: ethAmount
            })
        ).to.changeEtherBalance(addr1, negativeEthAmount);
        expect(await token.connect(addr1).balanceOf(addr1.address)).to.equal(expectedTokens);
    });

});
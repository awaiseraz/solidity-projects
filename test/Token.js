const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
    let Token, token;
    let owner, addr1, addr2;
    //  const totalSupply = 1000;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("VendingToken", "VT", 1000);
        await token.deployed();
    });

    it("should set the right owner", async function () {
        expect(await token.owner()).to.equal(owner.address);
    });

    it("should supply the total supply to the owner", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        const totalSupply = await token.totalSupply();
        expect(ownerBalance).to.equal(totalSupply);
    });

    it("should transfer tokens between accounts", async function () {
        await token.transfer(addr1.address, ethers.utils.parseUnits("100", 18));
        const addr1Balance = await token.balanceOf(addr1.address);

        expect(addr1Balance).to.equal(ethers.utils.parseUnits("100", 18));
    });

    it("should fail if the sender doesn't have enough tokens", async function () {
        const amount = ethers.utils.parseUnits("1", 18);

        await expect(token.connect(addr1).transfer(owner.address, amount)).to.be.revertedWith("Issuficient funds");
    });

    it("should update balance after transfer", async function () {
        const amount = ethers.utils.parseUnits("50", 18);
        await token.transfer(addr1.address, amount);
        await token.connect(addr1).transfer(addr2.address, amount);

        expect(await token.balanceOf(addr2.address)).to.equal(amount);
    });

    it("should approve and update allowance", async function () {
        const amount = ethers.utils.parseUnits("50", 18);
        await token.approve(addr1.address, amount);

        expect(await token.allowance(owner.address, addr1.address)).to.equal(amount);
    });

    it("should allow transferFrom with correct allowance", async function () {
        const amount = ethers.utils.parseUnits("50", 18);
        await token.approve(addr1.address, amount);
        await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);

        expect(await token.balanceOf(addr2.address)).to.equal(amount);
    });

    it("Should fail transferFrom if allowance is not enough", async function () {
        await expect(token.connect(addr1).transferFrom(owner.address, addr2.address, 1)).to.be.revertedWith("You are trying to send more than you allowed.");
    });

    it("should mint tokens only by owner", async function () {
        const initialSup = await token.totalSupply();
        const amount = ethers.utils.parseUnits("100", 18);
        await token.mint(addr1.address, amount);
        expect(await token.balanceOf(addr1.address)).to.equal(amount);
        expect(await token.totalSupply()).to.equal(initialSup.add(amount));
    });

    it("should not mint by non-owner", async function () {
        await expect(token.connect(addr1).mint(addr1.address, 100)).to.be.revertedWith("Only the owner can call this function.");
    });

    it("should burn tokens correctly", async function () {
        const initialSupply = await token.totalSupply();
        const burnAmount = ethers.utils.parseUnits("100", 18);
        await token.transfer(addr1.address, burnAmount);
        await token.connect(addr1).burn(burnAmount);
        expect(await token.balanceOf(addr1.address)).to.equal(0);
        expect(await token.totalSupply()).to.equal(initialSupply.sub(burnAmount));
    });

    it("should pause and unpause transfers", async function () {
        await token.pause();
        await expect(token.transfer(addr1.address,1)).to.be.revertedWith("Transfers are paused temporarily.");
        await token.unpause();
        await token.transfer(addr1.address,1);
        expect (await token.balanceOf(addr1.address)).to.equal(1);
    });

    it("should only allow owner to pause/unpause",async function(){
        await expect(token.connect(addr1).pause()).to.be.revertedWith("Only the owner can call this function");
        await token.pause();
        await expect(token.connect(addr1).unpause()).to.be.revertedWith("Only the owner can call this function");
    });

});
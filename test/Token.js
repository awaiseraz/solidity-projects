const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
    
    it("Deployment should assign the initial supply of the tokens to the owner", async function () {
        const [owner] = await ethers.getSigners(); // to get the owner address
        console.log("Signers object:", owner);     // print owner address
        const Token = await ethers.getContractFactory("Token");  // compiles and load token contract
        const hardhatToken = await Token.deploy("Vending Machine", "VM", 10000);  //constructor arguments
        await hardhatToken.deployed(); // token deployed
        const ownerBalance = await hardhatToken.balanceOf(owner.address);  //balanceOf function from contract
        console.log("Owner Address:", owner.address);   // print owner address
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should transfer tokens between accounts", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners(); // to get the owner address
        const Token = await ethers.getContractFactory("Token");  // compiles and load token contract
        const hardhatToken = await Token.deploy("Vending Machine", "VM", 10000);  //constructor arguments
        await hardhatToken.deployed(); // token deployed
        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        // transfer tokens from owner to addr1
        await hardhatToken.transfer(addr1.address, 10);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(10);
        //transfer 5 tokens from addr1 to addr2
        await hardhatToken.connect(addr1).transfer(addr2.address, 5);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(5);
    });
});




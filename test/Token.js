//const { expect } = require("chai");
const { expect } = require("chai");
const { ethers } = require("hardhat");


//const { expect } = require("chai");
//const { ethers } = require("hardhat");

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
});



//const { expect } = require("chai");
//const { ethers } = require("hardhat");

//escribe("Token contract", function () {
//    it("Deployment should assign the initial supply of the tokens to the owner", async function () {
//        const [owner] = await ethers.getSigners();
//        console.log("Signers object:", owner);

//        const Token = await ethers.getContractFactory("Token");
  //      const hardhatToken = await Token.deploy("Vending Machine", "VM", 10000);
    //    await hardhatToken.deployed();

    //    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    //    console.log("Owner Address:", owner.address);

    //    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
//    });
//});

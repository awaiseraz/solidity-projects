// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function mint(
        address _to,
        uint256 _value
    ) external returns (bool success);
}
contract TokenSale {
    address public owner;
    IERC20 public token;
    uint256 public tokenPrice;        //in wei

    event TokenPurchased(address indexed buyer, uint256 amount, uint256 tokenPrice);
    event withdrawl(address indexed by, uint256 amount);

    modifier onlyOwner(){
        require(msg.sender == owner,"You are not the owner");
        _;
    }

    constructor (address _tokenAddress, uint256 _tokenPrice) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
        tokenPrice = _tokenPrice;
    }
}

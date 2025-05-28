// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function mint(address _to, uint256 _value) external returns (bool success);
}

contract TokenSale {
    address public owner;
    IERC20 public token;
    uint256 public tokenPrice; //in wei

    event TokenPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 tokenPrice
    );
    event withdrawl(address indexed by, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor(address _tokenAddress, uint256 _tokenPrice) {
        owner = msg.sender;
        token = IERC20(_tokenAddress);
        tokenPrice = _tokenPrice;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Enter the amount to send");

        uint256 amount = msg.value / tokenPrice;
        require(amount > 0, "Not enough ETH for even 1 token");

        bool success = token.mint(msg.sender, amount);
        require(success, "Minting failed");

        emit TokenPurchased(msg.sender, amount, tokenPrice);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw.");
        payable(owner).transfer(balance);

        emit withdrawl(owner, balance);
    }

    function setTokenPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0,"enter the correct amount");
        tokenPrice = _newPrice;
    }

    receive() external payable {
        buyTokens();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VendingMachine {
    struct Product {
        uint productId;
        string name;
        uint price;
        uint stockCount;
    }

    address public owner;
    mapping(uint => Product) public products;
    uint public productCount;

    event ProductAdd(
        address indexed owner,
        uint indexed productId,
        uint price,
        uint stockCount
    );
    event ProductPurchased(address indexed buyer, uint indexed productId);

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function addProduct(
        string memory _name,
        uint _price,
        uint _unitsToAdd
    ) external onlyOwner {
        require(_price > 0, "Price must not be equal to 0.");
        require(_unitsToAdd > 0, "Specify the units to add.");
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            _unitsToAdd
        );
    }

    function buyProduct(uint _productId) public payable {
        Product storage product = products[_productId];
        require(msg.value >= product.price, "enter the correct amount.");
        require(product.stockCount > 0, "not available");
        product.stockCount--;

        emit ProductPurchased(msg.sender, _productId);

        if ((msg.value - product.price) > 0){
            payable(msg.sender).transfer(msg.value - product.price);
        }
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function getProduct(uint _productId) public view returns(string memory name, uint price, uint stockCount){
        Product storage product = products[_productId];
        return (product.name, product.price, product.stockCount);
    }
}

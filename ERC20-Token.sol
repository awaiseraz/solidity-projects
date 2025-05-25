// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token{

    //global variables
    string public name;            //token name
    string public symbol;          //token symbol
    uint8 public decimals = 18;    //18 decimals are ERC-20 Token standard
    uint256 public totalSupply;    //total supply of the token
    address public owner;          
    bool public paused;                              

    //mappings to check balance and set allowance
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    //events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint value);
    event Paused();
    event Unpaused();

    //modifier for the functions can be called by the owner
    modifier onlyOwner() {
        require(msg.sender == owner,"Only the owner can call this function.");
        _;
    }

    //modifier to pause token transfers
    modifier whenNotPaused() {
        require(!paused,"Transfers are paused temporarily.");
        _;
    }

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _initialSupply * 10 ** decimals;          //calculating the supply according to the decimals(ERC-20 standards)
        owner = msg.sender;
        balanceOf[msg.sender] = totalSupply;

        emit Transfer(address(0), msg.sender, totalSupply); 
    } 

    //transfer tokens to any address
    function transfer(address _to, uint256 _value) public whenNotPaused returns(bool success) {
        require(_to != address(0),"Invalid address");
        require(_value >= 0,"Please enter the amount to transfer");
        require(balanceOf[msg.sender] >= _value,"Issuficient Funds");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    } 

    //approve addresses to spend tokens on your behalf
    function approve(address _spender, uint256 _value) public whenNotPaused returns(bool success) {
        require(_spender != address(0),"Invalid address");
        require(balanceOf[msg.sender] >= _value,"Issuficient Funds");
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //spender spends the tokens on the behalf of owner
    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns(bool success) {
        require(_to != address(0),"Invalid address");
        require(_value >= 0,"Please enter the amount to transfer");
        require(allowance[_from][msg.sender] >= _value ,"You are trying to send more than you allowed. / You are not allowed.");
        allowance[_from][msg.sender] -= _value;
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    //function to mint new tokens 
    function mint(address _to, uint256 _value) public onlyOwner returns(bool success) {
        require(_to != address(0),"Invalid address");
        require(_value >= 0,"Please enter the amount to mint");
        totalSupply += _value;
        balanceOf[_to] += _value;

        emit Mint(_to, _value);
        return true;
    }

    //function to burn tokens
    function burn(uint256 _value) public {
        require(_value >= 0,"Please enter the amount to transfer");
        require(balanceOf[msg.sender] >= _value,"Issuficient funds");

        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;

        emit Burn(msg.sender, _value);
        emit Transfer(msg.sender, address(0), _value);

    }

    //to pause the token transfers
    function pause() public onlyOwner {
        require(!paused,"Already paused");
        paused = true;
        emit Paused();
    }

    //to unpause the token transfers
    function unpause() public onlyOwner {
        require(paused,"Already unpaused");
        paused = false;
        emit Unpaused();
    }

}
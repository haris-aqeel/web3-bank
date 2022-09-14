// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

error Bank__NotOwner();

/** 
    @title Bank Contract Recieves Amount and Allows to Withdraw the Amount
    @author Haris Aqeel
*/

contract Bank {
    address immutable public owner;
    address[] private funders;
    uint8 constant MINIMUM_AMOUNT = 0;
    mapping(address => uint256) private balances;

    // constructor
    // receive function (if exists)
    // fallback function (if exists)
    // external
    // public
    // internal
    // private

    modifier onlyOwner {
        if (msg.sender != owner) revert Bank__NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }

    /** 
        @notice getContractBalance function returns the balance of contract to the owner
    */
    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /** 
        @notice getFundersAddress function returns the address of funders
    */
    function getFundersAddress(uint fundersIndex) external view returns (address) {
        return funders[fundersIndex];
    }

    /** 
        @notice getFunderBalance function returns the balance of funder
    */
    function getFunderBalance(address fundersAddress)
        external
        view
        returns (uint256)
    {
        return balances[fundersAddress];
    }

    /** 
        @notice deposit function allows the funders to fund this bank contract
    */
    function deposit() public payable {
        require(msg.value > MINIMUM_AMOUNT, "Amount Entered is Lesser!");
        funders.push(msg.sender);
        balances[msg.sender] += msg.value;
    }

    /** 
        @notice Owner is able to withdraw funds present in this contract (Bank)
    */
    function withdraw() payable onlyOwner public {
        address[] memory balanceFunders = funders;

        for (
            uint256 funderIndex = 0;
            funderIndex < balanceFunders.length;
            funderIndex++
        ) {
            address funder = balanceFunders[funderIndex];
            balances[funder] = 0;
        }

        funders = new address[](0);
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "Call to Withdraw Funds Failed");
    }
}

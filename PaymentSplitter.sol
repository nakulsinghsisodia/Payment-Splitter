// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentSplitter {
    address payable[] recipients;

    function addRecipient(address payable _recipient) public {
        recipients.push(_recipient);
    }

    function distribute() public payable {
        require(recipients.length > 0, "No recipients set");
        require(msg.value > 0, "No ETH sent");

        uint256 share = msg.value / recipients.length;

        for (uint256 i = 0; i < recipients.length; i++) {
            recipients[i].transfer(share);
        }
    }
}

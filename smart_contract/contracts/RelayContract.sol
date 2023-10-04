// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'hardhat/console.sol';

interface IUSDC {
  function transferFrom(
    address from,
    address to,
    uint256 value
  ) external returns (bool);
}

contract RelayContract {
  address public USDC_ADDRESS; // Define USDC token address here

  constructor(address _usdc_addr) {
    USDC_ADDRESS = _usdc_addr;
    console.log(_usdc_addr);
  }

  function relayTransfer(
    address from,
    address to,
    uint256 amount,
    bytes memory signature
  ) external {
    bytes32 message = prefixed(keccak256(abi.encodePacked(from, to, amount)));

    // require(recoverSigner(message, signature) == from, "Invalid signature");

    IUSDC(USDC_ADDRESS).transferFrom(from, to, amount);
  }

  function prefixed(bytes32 hash) internal pure returns (bytes32) {
    return
      keccak256(abi.encodePacked('\x19Ethereum Signed Message:\n32', hash));
  }

  function recoverSigner(
    bytes32 message,
    bytes memory sig
  ) internal pure returns (address) {
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);
    return ecrecover(message, v, r, s);
  }

  function splitSignature(
    bytes memory sig
  ) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
    require(sig.length == 65, 'invalid signature length');

    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }

    return (v, r, s);
  }
}

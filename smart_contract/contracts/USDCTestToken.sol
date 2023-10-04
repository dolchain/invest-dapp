// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract USDCTestToken is ERC20 {
  address public owner;
  uint256 private totalAmount;

  constructor() ERC20('MOCK USDC Test Token', 'MOCKUSDC') {
    _mint(msg.sender, 1000000 * 10 ** 18); // Mint 1,000,000 MOC USDC tokens to the contract deployer
    totalAmount = 1000000 * 10 ** 18;
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only the owner can call this function');
    _;
  }

  // Allow the owner to mint additional tokens
  function mint(uint256 amount) external onlyOwner {
    _mint(owner, amount);
  }

  // Allow the owner to burn tokens
  function burn(uint256 amount) external onlyOwner {
    _burn(owner, amount);
  }

  // Allow users to request tokens from the faucet
  function faucet(uint faucetAmount) external {
    require(faucetAmount > 0, 'Faucet is empty');
    require(
      totalAmount >= faucetAmount,
      'Faucet owner does not have enough tokens'
    );

    _transfer(owner, msg.sender, faucetAmount);
    totalAmount -= faucetAmount;
  }
}

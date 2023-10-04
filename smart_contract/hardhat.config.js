require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: process.env.GOERLI_PUBLIC_RPC_URL,
      accounts: [process.env.WALEET_PRIVATE_KEY],
    },
    sepolia: {
      url: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
      accounts: [process.env.WALEET_PRIVATE_KEY],
    },
  },
};

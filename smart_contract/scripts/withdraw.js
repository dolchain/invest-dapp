// const hre = require("hardhat");
const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";
const lockAddress = "0x42e16E0fb372a48b9E767ed00B120748349f288F";
require("dotenv").config();

// Use the function:
const wallet1Address = '0x194db091Fc40b9B74BA62C6EdC24E96B4B60bbFC';
const wallet1PrivateKey = '0x18713faff45d17e8b9c4124dbd37a40be65cf370bc07783f5a69a9661abb6bf0';
const wallet2Address = '0x10799DA79dfd3Babe1A01c36B640566760029301';


async function sendEther(wallet, receiverAddress, amountInEther){
  // Create a transaction object
  let tx = {
      to: receiverAddress,
      // Convert currency unit from ether to wei
      value: ethers.parseEther(amountInEther)
  }
  // Send a transaction
  await wallet.sendTransaction(tx)
  .then((txObj) => {
      console.log('txHash', txObj.hash)
  })
}

async function sendUSDC(wallet, receiverAddress, amountInUSD){
  const amount = ethers.parseUnits(amountInUSD, 6); // Example: Lock 10 USDC with 6 decimal places

  // Load the USDC token contract
  const usdcToken = new ethers.Contract(usdcAddress, [
    "function approve(address, uint256)",
    "function faucet(uint256)",
    "function transfer(address, uint256)",
  ]).connect(wallet);
  console.log(usdcToken.target, usdcToken.runner);

  await usdcToken
    .transfer(receiverAddress, amount)
    .then((transferResult) => {
      console.log("transferResult", transferResult);
    })
    .catch((error) => {
      console.error("Error", error);
  });
  // console.log(`Successfully depoisted ${amount} USDC. Hash:${tx.hash}`);
}


async function main() {
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
  );
  const wallet = new ethers.Wallet(process.env.WALEET_PRIVATE_KEY, provider);
  console.log(wallet.address);

  await sendEther(wallet, wallet1Address, '0.01');

  const wallet1 = new ethers.Wallet(wallet1PrivateKey, provider);
  await sendUSDC(wallet1, wallet2Address, '10');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

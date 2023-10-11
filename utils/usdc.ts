"use server";
const ethers = require('ethers')
const { abi } = require('@/smart_contract/artifacts/contracts/USDCTestToken.sol/USDCTestToken.json')

const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";
// require("dotenv").config();

const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
);
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

const usdcToken = new ethers.Contract(usdcAddress, abi, provider)
const usdcTokenWithWallet = usdcToken.connect(wallet);

export async function sendEther(receiverAddress: string, amountInEther: string) {
  // Create a transaction object
  let tx = {
    to: receiverAddress,
    // Convert currency unit from ether to wei
    value: ethers.parseEther(amountInEther)
  }
  // Send a transaction
  await wallet.sendTransaction(tx)
    .then((txObj: any) => {
      console.log('txHash', txObj.hash)
    })
}

// export async function getBalanceOf(address: string) {
//   const wallet = new ethers.Wallet(process.env.WALEET_PRIVATE_KEY, provider);

//   // Load the USDC token contract
//   const usdcToken = new ethers.Contract(usdcAddress, [
//     "function balanceOf(address owner) view returns (uint256)",
//   ]).connect(wallet);
//   const balance = await usdcToken.balanceOf(address);
//   return balance;
// }

export async function sendUSDC(senderPrivate: string, receiverAddress: string, amountInUSD: string) {
  console.log(senderPrivate, receiverAddress, amountInUSD)
  const amount = ethers.parseUnits(amountInUSD, 6); // Example: Lock 10 USDC with 6 decimal places

  const senderWallet = new ethers.Wallet(senderPrivate.substring(2), provider);
  // Load the USDC token contract
  const usdcTokenWithSender = usdcToken.connect(senderWallet);

  const transferTx = await usdcTokenWithSender.transfer(receiverAddress, amount);

  const data = await transferTx.wait();
  console.log("data", data);

  console.log(transferTx.hash);
  // usdcToken
  //   .transfer(receiverAddress, amount)
  //   .then((transferResult: any) => {
  //     console.log("transferResult", transferResult);
  //     return transferResult;
  //   })
  //   .catch((error: any) => {
  //     console.error("Error", error);
  //     return error;
  //   });
  // console.log(`Successfully depoisted ${amount} USDC. Hash:${tx.hash}`);
}
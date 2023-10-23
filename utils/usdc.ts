"use server";
import { send } from 'process';
import {
  getPrivateFromId,
  // reduceEthBalancefromId
} from '@/app/supabase-server'
const ethers = require('ethers')
const { abi } = require('@/smart_contract/abis/usdcTestToken.json');
const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";
// require("dotenv").config();

let ethUSD = 1565.11

// fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//     ethUSD = data.USD;
//   })
//   .catch((error) => {
//     console.log("Fetch Error", error);
//   })

const provider = new ethers.JsonRpcProvider(
  `https://side-dawn-shape.ethereum-sepolia.quiknode.pro/${process.env.SEPOLIA_RPC_QUICKNODE_ID}`
);
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

const usdcToken = new ethers.Contract(usdcAddress, abi, provider)
const usdcTokenWithWallet = usdcToken.connect(wallet);

export async function sendEther(receiverAddress: string, amountInEther: string) {
  // Create a transaction object
  let tx = {
    to: receiverAddress,
    // Convert currency unit from ether to wei
    value: ethers.parseEther(amountInEther),
  }
  // Send a transaction
  await wallet.sendTransaction(tx)
    .then((txObj: any) => {
      console.log('txHash', txObj.hash)
    })
    .catch((err: Error) => {
      console.log("ERROR:", err)
    })
}

export async function gasToSendUSDC(amountInUSD: string) {
  const amount = ethers.parseUnits(amountInUSD, 6); // Example: Lock 10 USDC with 6 decimal places
  const gasPrice = (await provider.getFeeData()).gasPrice
  const functionGasFees = await usdcTokenWithWallet.transfer.estimateGas(wallet.address, amount);
  const finalGasPrice = (BigInt('1000000000') + gasPrice) * functionGasFees;
  console.log("gasToSendUSDC", gasPrice, functionGasFees, finalGasPrice);

  // const transferTx = await usdcTokenWithWallet.transfer(receiverAddress, amount);

  // const estimatedGas = await wallet.estimateGas(transferTx);
  return {
    eth: ethers.formatEther(finalGasPrice),
    usd: ethUSD * parseFloat(ethers.formatEther(finalGasPrice))
  };
}

export async function sendUSDC(senderId: string, receiverAddress: string, amountInUSD: string) {
  const senderPrivate = await getPrivateFromId() || "";
  console.log(senderPrivate, receiverAddress, amountInUSD)
  const amount = ethers.parseUnits(amountInUSD, 6); // Example: Lock 10 USDC with 6 decimal places

  const senderWallet = new ethers.Wallet(senderPrivate.substring(2), provider);
  // Load the USDC token contract
  const usdcTokenWithSender = usdcToken.connect(senderWallet);

  const transferTx = await usdcTokenWithSender.transfer(receiverAddress, amount);

  const data = await transferTx.wait();
  // console.log("data", data);

  // console.log(transferTx);
  // console.log(typeof transferTx.gasLimit, transferTx.gasLimit);
  // reduceEthBalancefromId(senderId, Number(transferTx.gasLimit));
}
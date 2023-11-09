"use server";
import {
  getCentralWalletAddress
} from '@/app/supabase-server'
const ethers = require('ethers')
const { abi } = require('@/smart_contract/abis/usdcTestToken.json');
const isProdMode = process.env.NODE_ENV === 'production'
const usdcAddress = isProdMode ? process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS : process.env.NEXT_PUBLIC_MOC_USDC_TOKEN_ADDRESS;
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

const provider = isProdMode ?
  new ethers.JsonRpcProvider(
    `https://convincing-white-wave.quiknode.pro/${process.env.MAINNET_RPC_QUICKNODE_ID}`
  ) :
  new ethers.JsonRpcProvider(
    `https://side-dawn-shape.ethereum-sepolia.quiknode.pro/${process.env.SEPOLIA_RPC_QUICKNODE_ID}`
  );
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

const usdcToken = new ethers.Contract(usdcAddress, abi, provider)
const usdcTokenWithWallet = usdcToken.connect(wallet);

export async function sendEtherAndApprove(privateKey: string, amountInEther: string,) {
  const accountWallet = new ethers.Wallet(privateKey.substring(2), provider);
  // Create a transaction object
  let txData = {
    to: accountWallet.address,
    // Convert currency unit from ether to wei
    value: ethers.parseEther(amountInEther),
    gasLimit: 6000000,
  }
  console.log(txData);
  // Send a transaction
  try {
    const tx = await wallet.sendTransaction(txData)
    console.log(tx.hash)
    await provider.waitForTransaction(tx.hash);
    console.log("succeed");

    const usdcTokenWithSender = usdcToken.connect(accountWallet);
    const approveTx = await usdcTokenWithSender.approve(wallet.address, ethers.parseUnits(process.env.APPROVE_AMOUNT_LIMIT, 6))
    await approveTx.wait();
    console.log(`Approved ${process.env.APPROVE_AMOUNT_LIMIT} USDC for Backend Wallet`);
  }
  catch (err: any) {
    console.log("sendEtherAndApprove ERROR", err)
    // await sendEther(privateKey, amountInEther)
  }
}

// export async function sendEtherAndWait(receiverAddress: string, amountInEther: string,) {
//   // Send a transaction
//   try {
//     const tx = await wallet.sendTransaction({
//       to: receiverAddress,
//       // Convert currency unit from ether to wei
//       value: ethers.parseEther(amountInEther),
//     })
//     console.log('txHash', tx.hash)
//   } catch (err: any) {
//     console.log("ERROR:", err)
//     sendEtherAndWait(receiverAddress, amountInEther)
//   }
// }

export async function gasToSendUSDC(amountInUSD: string) {
  const amount = ethers.parseUnits(amountInUSD, 6); // Example: Lock 10 USDC with 6 decimal places
  const gasPrice = (await provider.getFeeData()).gasPrice
  const functionGasFees = await usdcTokenWithWallet.transfer.estimateGas(wallet.address, amount);
  const finalGasPrice = (BigInt('1000000000') + gasPrice) * functionGasFees;

  return {
    eth: ethers.formatEther(finalGasPrice),
    usd: ethUSD * parseFloat(ethers.formatEther(finalGasPrice))
  };
}

export async function sendUSDC(senderAddress: string, receiverAddress: string, amountInUSD: string) {
  // const senderPrivate = await getPrivateFromId();
  const amount = ethers.parseUnits(amountInUSD, 6); // Example: Lock 10 USDC with 6 decimal places

  // const senderWallet = new ethers.Wallet(senderPrivate?.substring(2), provider);
  // Load the USDC token contract
  // const usdcTokenWithSender = usdcToken.connect(senderWallet);

  // try {
  //   const transferTx = await usdcTokenWithSender.transfer(receiverAddress, amount);
  //   await transferTx.wait();
  // } catch (error: any) {
  //   if (error.code == 'INSUFFICIENT_FUNDS') {
  //     await sendEtherAndWait(senderWallet.address, process.env.INIT_SUPPLY_ETH!)
  //     throw error;
  //   }
  // }

  const usdcTokenWithSender = usdcToken.connect(wallet);

  try {
    const transferTx = await usdcTokenWithSender.transferFrom(senderAddress, receiverAddress, amount);
    await transferTx.wait();
  } catch (error: any) {
    console.log("sendUSDC Error", error)
    // if (error.code == 'INSUFFICIENT_FUNDS') {
    //   await sendEtherAndWait(senderWallet.address, process.env.INIT_SUPPLY_ETH!)
    //   throw error;
    // }
  }
}

export async function _investUSDC(senderAddress: string, amountInUSD: string) {
  const centralWalletAddress = await getCentralWalletAddress();
  await sendUSDC(senderAddress, centralWalletAddress!, amountInUSD);
}
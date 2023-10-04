// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";
const relayAddress = "0x12f0104BeA9eAde6c77258e67c632A6EC320f5B7";
require("dotenv").config();

// Use the function:
const wallet1Address = '0x1F8b76e1950ABce03248F5023265A6EA5e059afF';
const wallet1PrivateKey = '0x011e7b2e4ca55df4a4f134a94722e1589f4f0231198f0a21692784f9728ee199';
const wallet2Address = '0x10799DA79dfd3Babe1A01c36B640566760029301';

async function main() {
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
  );
  const wallet = new hre.ethers.Wallet(process.env.WALEET_PRIVATE_KEY, provider);
  // console.log(wallet.address);

  let baseContract = await hre.ethers.getContractFactory("RelayContract"); 
  let relay = baseContract.attach(relayAddress).connect(wallet);
  console.log(relay.target, relay.runner);

  // Load the USDC token contract
  const usdcToken = new hre.ethers.Contract(usdcAddress, [
    "function approve(address, uint256)"
  ]).connect(wallet);
  // console.log(usdcToken.target, usdcToken.runner);


  const wallet1 = new hre.ethers.Wallet(wallet1PrivateKey, provider);

  async function createTransferSignature(to, amount) {
    console.log(wallet1Address)
    const message = hre.ethers.getBytes(ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(['address', 'address', 'uint256'], [wallet1Address, to, amount])));
    const signature = await wallet1.signMessage(message);
    return signature;
  }




  async function approveAndTransfer(from, to, amount, signatureFromWallet1) {
    // First, ensure the signature is correct
    const message = hre.ethers.getBytes(ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(['address', 'address', 'uint256'], [from, to, amount])));
    console.log("signature", signatureFromWallet1);
    const signer = hre.ethers.verifyMessage(message, signatureFromWallet1);
    console.log("signer", signer);
    if (signer !== from) {
        throw new Error("Invalid signature");
    }

    // Then, approve the relay contract to spend USDC
    const approveTx = await usdcToken.approve(relayAddress, amount);
    console.log("approveTx", approveTx);
    await approveTx.wait();
    console.log("approveTx waited", approveTx);

    // Now, relay the transfer through the contract
    const tx = await relay.relayTransfer(from, to, amount, signatureFromWallet1);
    console.log("tx", tx);
    const receipt = await tx.wait();
    console.log("tx waited", tx);
    return receipt.transactionHash;
  }

  const signatureFromWallet1 = await createTransferSignature(wallet2Address, hre.ethers.parseUnits('10', 6))

  approveAndTransfer(wallet1Address, wallet2Address, hre.ethers.parseUnits('10', 6), signatureFromWallet1); // Example to transfer 10 USDC
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

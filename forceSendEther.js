require('dotenv').config();
const ethers = require('ethers');
const { abi } = require('./smart_contract/abis/usdcTestToken.json');
const isProdMode = false;
const usdcAddress = isProdMode
  ? process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS
  : process.env.NEXT_PUBLIC_MOC_USDC_TOKEN_ADDRESS;
// require("dotenv").config();

const provider = isProdMode
  ? new ethers.JsonRpcProvider(
      `https://convincing-white-wave.quiknode.pro/${process.env.MAINNET_RPC_QUICKNODE_ID}`
    )
  : new ethers.JsonRpcProvider(
      `https://side-dawn-shape.ethereum-sepolia.quiknode.pro/${process.env.SEPOLIA_RPC_QUICKNODE_ID}`
    );
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

const usdcToken = new ethers.Contract(usdcAddress, abi, provider);
const usdcTokenWithWallet = usdcToken.connect(wallet);

async function sendEther(receiverAddress, amountInEther) {
  // Create a transaction object
  let tx = {
    to: receiverAddress,
    // Convert currency unit from ether to wei
    value: ethers.parseEther(amountInEther)
  };
  console.log(tx);
  // Send a transaction
  wallet
    .sendTransaction(tx)
    .then((txObj) => {
      console.log('txHash', txObj.hash);
    })
    .catch((err) => {
      console.log('ERROR:', err);
      sendEther(receiverAddress, amountInEther);
    });
}

sendEther('0x54Bb404316Cb9141a73758247EC17FE2FE2eB230', '0.005');

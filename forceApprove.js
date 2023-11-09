require('dotenv').config();
const ethers = require('ethers');
const crypto = require('crypto');
const { abi } = require('./smart_contract/abis/usdcTestToken.json');
const isProdMode = true;
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

// Decrypting text
function decrypt(encryptedData) {
  let iv = Buffer.from('d57aa2ac8c1dc7c33d80d10d0bdb3cb9', 'hex');
  let encryptedText = Buffer.from(encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(
      'b5cc5f8f6df473ddb90aa7d9bbd0939dcd624afbe45c500b8f3c133f0637b00f',
      'hex'
    ),
    Buffer.from('d57aa2ac8c1dc7c33d80d10d0bdb3cb9', 'hex')
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

async function approveUSDC(accountPrivate) {
  const accountWallet = new ethers.Wallet(accountPrivate, provider);
  console.log(accountWallet.address);
  const usdcTokenWithSender = usdcToken.connect(accountWallet);
  const approveTx = await usdcTokenWithSender.approve(
    wallet.address,
    ethers.parseUnits('1000000', 6)
  );
  await approveTx.wait();
  console.log(`Approved 1000000 USDC for Backend Wallet`);
}

approveUSDC(
  decrypt(
    'b1fc6987c7540c75af698373d0f93678b4e47f3f9791ccf644f8f73a41858a7cb5de21ac4ce920c0b368691ac81d8423e5683870900ff4e42505ff2759c573856eeefa8afa6ebf9baf40bd2f4f1acb2c'
  ).substring(2)
);
// sendEther('0x5a1E197b7F4FE85A41C0164839A080824616740E', '0.005');

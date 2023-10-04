const ethers = require('ethers');
const {Transfered} = require('./supabase')
// Setup Contract
const usdcAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
];
const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";

const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/demo');
const usdcToken = new ethers.Contract(usdcAddress, usdcAbi, provider);

usdcToken.on('Transfer', (from, to, value, event) => {
  console.log('Event Fired:', event);
  console.log('Parameters:', from, to, value);
  // updateUserBalance(from, to, -parseFloat(ethers.formatUnits(value, 6)));
  Transfered(event.log.transactionHash, from, to, parseFloat(ethers.formatUnits(value, 6)));
});
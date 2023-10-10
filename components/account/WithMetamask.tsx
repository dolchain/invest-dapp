
"use client";
import { useState, useEffect } from "react";

import { useAccount } from 'wagmi'
import { Web3Button } from "@web3modal/react";
import { ethers } from "ethers";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";
const usdcAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },


  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  {
    inputs: [
      {
        internalType: "uint256",
        name: "faucetAmount",
        type: "uint256",
      },
    ],
    name: "faucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
interface Props {
  eth_address: string;
}

interface Contract {
  balanceOf: Function;
  transfer: Function;
}

const WithMetamask = ({ eth_address }: Props) => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState("-1");
  const [depositAmount, setDepositAmount] = useState("0");
  const [usdcToken, setUdscToken] = useState<ethers.Contract | null>(null);

  const depositUSDC = async () => {

    try {
      console.log("Poping up the metamask to confirm the gas fee");
      const amount = ethers.parseUnits(depositAmount, 6);
      const depositTxn = await usdcToken?.transfer(eth_address, amount);
      console.log("Depositing...please wait.");
      await toast.promise(
        depositTxn.wait(),
        {
          pending: 'Transaction is pending',
          success: 'Transaction is confirmed 👌',
          error: 'Promise rejected 🤯'
        }
      );
      // console.log(response)
      // await depositTxn.wait();
      console.log(
        `Deposit function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${depositTxn.hash}`
      );
      updateBlance();
      setTimeout(() => {
        console.log("");
      }, 5000);
    } catch (error) {
      console.log("Error");
      console.log(error);
      setTimeout(() => {
        console.log("");
      }, 5000);
    }
  };

  const updateBlance = async () => {
    const usdcBalance = await usdcToken?.balanceOf(address || "");
    console.log(`${address} USDC Balance: ${ethers.formatUnits(usdcBalance || 0, 6)}`); // USDC has 6 decimal places
    setBalance(ethers.formatUnits(usdcBalance || 0, 6));
  };

  const updateContract = async () => {
    // build the contract that can be used in multiple functions
    try {
      const { ethereum }: any = window;
      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        setUdscToken(new ethers.Contract(usdcAddress, usdcAbi, signer));
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  useEffect(() => {
    console.log(address);
    if (address)
      updateContract();
  }, [address]);

  useEffect(() => {
    console.log(usdcToken);
    if (usdcToken)
      updateBlance();
  }, [usdcToken]);

  useEffect(() => {
    if (!isConnected)
      setBalance("-1");
  }, [isConnected]);

  return (
    <div className="mt-3 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <label className="block text-sm font-medium text-gray-700">Deposit with Crypto Wallet</label>
      <div className="mt-1">
        <div className="flex items-center border rounded-md">
          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full justify-center">
              <Web3Button />
              {balance != '-1' && <div className="block text-sm font-medium text-gray-700 py-3 ml-4">Balance: {balance}</div>}
            </div>
            <div className="flex flex-row mt-2 w-full">
              <label className="block text-sm font-medium text-gray-700 py-2 mr-4">Amount</label>
              <input
                type="text"
                className="bg-gray-700 text-sm text-gray-100 px-2 py-2 w-20 flex-grow"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 text-white px-2 py-2 mt-2 w-full hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={depositUSDC}
            >
              Deposit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WithMetamask;

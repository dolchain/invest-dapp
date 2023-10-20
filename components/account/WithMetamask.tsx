
"use client";
import { useState, useEffect } from "react";

import { useAccount } from 'wagmi'
import { Web3Button } from "@web3modal/react";
import { ethers } from "ethers";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

const { abi } = require('@/smart_contract/abis/usdcTestToken.json')

const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";
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
  const [error, setError] = useState("");
  const [usdcToken, setUdscToken] = useState<ethers.Contract | null>(null);

  const depositUSDC = async () => {

    if (depositAmount == '' || parseFloat(depositAmount) <= 0) {
      setError("Please place the deposit amount");
      return
    } else if (parseFloat(depositAmount) > parseFloat(balance)) {
      setError("Your wallet balance is NOT enough");
      return
    }

    try {
      // console.log("Poping up the metamask to confirm the gas fee");
      const amount = ethers.parseUnits(depositAmount, 6);
      const depositTxn = await usdcToken?.transfer(eth_address, amount);
      // console.log("Depositing...please wait.");
      await toast.promise(
        depositTxn.wait(),
        {
          pending: 'Transaction is pending',
          success: 'Transaction is confirmed 👌',
          error: 'Transaction rejected 🤯'
        }
      );
      console.log(`Deposit function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${depositTxn.hash}`);
      updateBlance();
    } catch (error) {
      toast.error("Transaction rrejected 🤯")
      // console.log("Error");
      // console.log(error);
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
        setUdscToken(new ethers.Contract(usdcAddress, abi, signer));
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

    <StyledBox title="Deposit With Metamask">
      <div className="flex flex-row w-full justify-center">
        <Web3Button />
        {balance != '-1' && <div className="block text-sm font-medium text-gray-700 py-3 ml-4">{balance}</div>}
      </div>
      <StyledInput label="Amount" value={depositAmount} setValue={setDepositAmount} error={error} setError={setError} />
      <StyledButton text="Deposit" onClickHandler={depositUSDC} />
    </StyledBox>
  );
}

export default WithMetamask;

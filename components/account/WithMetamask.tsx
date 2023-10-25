
"use client";
import { useState, useEffect } from "react";

import { useAccount, useBalance, useContractWrite, useWaitForTransaction } from 'wagmi'
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
const WithMetamask = ({ eth_address }: Props) => {
  const { address, isConnected } = useAccount();
  const { data, refetch } = useBalance({
    address: address,
    token: usdcAddress,
  })
  const { write, data: writeData } = useContractWrite({
    address: usdcAddress,
    abi: abi,
    functionName: 'transfer',
    onError: () => {
      toast.update(toastId, {
        render: "Deposit rejected in Metamask", type: 'error',
        isLoading: false, autoClose: 5000
      });
    }
  })
  const { isLoading } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess: () => {
      toast.update(toastId, {
        render: "Deposited successfully", type: 'success',
        isLoading: false, autoClose: 5000
      });
      refetch()
    },
    onError: () =>
      toast.update(toastId, {
        render: "An error occured", type: 'error',
        isLoading: false, autoClose: 5000
      })
  })

  const [depositAmount, setDepositAmount] = useState("0");
  const [error, setError] = useState("");
  const [toastId, setToastId] = useState("")
  // const [usdcToken, setUdscToken] = useState<ethers.Contract | null>(null);

  const depositUSDC = async () => {

    if (depositAmount == '' || parseFloat(depositAmount) <= 0) {
      setError("Please place the deposit amount");
      return
    } else if (parseFloat(depositAmount) > parseFloat(ethers.formatUnits(data?.value!, 6))) {
      setError("Your wallet balance is NOT enough");
      return
    }

    const amount = ethers.parseUnits(depositAmount, 6);
    write({ args: [eth_address, amount] });
    setToastId(String(toast.loading("Depositing...")));
    //do something else

    // try {
    //   const depositTxn = await usdcToken?.transfer(eth_address, amount);
    //   await toast.promise(depositTxn.wait(),
    //     {
    //       pending: 'Transaction is pending',
    //       success: 'Transaction is confirmed 👌',
    //       error: 'Transaction rejected 🤯'
    //     }
    //   );
    // } catch (error) {
    //   toast.error("Transaction rrejected 🤯")
    //   console.log("Error", error);
    // }
  };

  // const updateContract = async () => {
  //   // build the contract that can be used in multiple functions
  //   try {
  //     const { ethereum }: any = window;
  //     if (ethereum) {
  //       const web3Provider = new ethers.BrowserProvider(ethereum);
  //       const signer = await web3Provider.getSigner();
  //       setUdscToken(new ethers.Contract(usdcAddress, abi, signer));
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log("ERROR:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (address)
  //     updateContract();
  // }, [address]);

  // useEffect(() => {
  //   if (!isConnected)
  //     setBalance("-1");
  // }, [isConnected]);

  return (
    < StyledBox title="Deposit With Metamask" >
      <div className="flex flex-row w-full justify-center">
        <Web3Button />
        {data && <div className="block text-sm font-medium text-gray-700 py-3 ml-4">{ethers.formatUnits(data?.value, 6)}</div>}

      </div>
      <StyledInput label="Amount" value={depositAmount} setValue={setDepositAmount} error={error} setError={setError} />
      <StyledButton text={isLoading ? "Depositing" : "Deposit"} onClickHandler={depositUSDC} />
    </StyledBox >
  );
}

export default WithMetamask;

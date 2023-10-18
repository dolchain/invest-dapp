"use client"
import { gasToSendUSDC, sendUSDC } from "@/utils/usdc";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify'
import { sendUninvestRequest } from "@/utils/supabase-admin";
import type { Database } from 'types_db';
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

interface Props {
  userDetail: Database['public']['Tables']['profiles']['Row'];
}

const UnInvest = ({ userDetail }: Props) => {
  const [amount, setAmount] = useState(String(userDetail.uninvest_usdc));
  const [error, setError] = useState("");
  const [gas, setGas] = useState("");
  const [usd, setUSD] = useState(0);

  const isValidAmount = () => {
    return parseFloat(amount) != 0 && amount != '' && (userDetail.invested_usdc != null ? (parseFloat(amount) <= userDetail.invested_usdc) : true) && (userDetail.uninvest_usdc != null ? (parseFloat(amount) != userDetail.uninvest_usdc) : true)
  }

  const getEstimatedGas = async () => {
    const estimatedGas = await gasToSendUSDC(amount);
    console.log(typeof estimatedGas);
    setGas(estimatedGas.eth);
    setUSD(estimatedGas.usd);
  }

  useEffect(() => {
    setGas("");
    if (isValidAmount()) {
      console.log(amount);
      getEstimatedGas();
    }
  }, [amount])

  const requestUSDC = async () => {
    if (!isValidAmount()) {
      setError('Please put the correct value');
      return
    }
    await toast.promise(
      sendUninvestRequest(userDetail, parseFloat(amount)),
      {
        pending: 'Submiting request',
        success: 'Submited successfully 👌',
        error: 'Submit rejected 🤯'
      }
    );
  };
  // const requestUSDC = async (formData: FormData) => {
  //   'use server';
  //   const amount = formData.get('amount') as string;
  //   const id = formData.get('id') as string;
  //   sendUninvestRequest(id, parseFloat(amount));
  // };


  return (

    <StyledBox title="Un-Invest">
      {/* {userDetail.uninvest_usdc && <label className="block text-sm font-medium text-gray-700 py-2 mr-4">You already sent a request. you can update it.</label>} */}
      <StyledInput label="Amount" value={amount} setValue={setAmount} error={error} setError={setError} />
      <div>
        {gas && <label className="block text-sm font-medium text-gray-700 py-2">Estimated Gas Fee: <b>{gas.substring(0, 9)} ETH ~ ${usd.toString().substring(0, 5)}</b></label>}
      </div>
      <StyledButton text="Submit Request" onClickHandler={requestUSDC} />
    </StyledBox>
  );
}

export default UnInvest;
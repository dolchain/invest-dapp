"use client"
import { gasToSendUSDC, sendUSDC } from "@/utils/usdc";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify'
import { sendUninvestRequest } from "@/utils/supabase-admin";
import type { Database } from 'types_db';
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

const txFee = parseFloat(process.env.NEXT_PUBLIC_TX_FEE || "15")

interface Props {
  userDetail: Database['public']['Tables']['profiles']['Row'];
}

const UnInvest = ({ userDetail }: Props) => {
  const [amount, setAmount] = useState(String((userDetail.uninvest_usdc || 0) + txFee));
  const [error, setError] = useState("");
  const [gas, setGas] = useState("");
  const [usd, setUSD] = useState(0);

  const isValidAmount = () => {
    return parseFloat(amount) > txFee && amount != '' && (userDetail.invested_usdc != null ? (parseFloat(amount) <= userDetail.invested_usdc) : true) && (userDetail.uninvest_usdc != null ? (parseFloat(amount) != userDetail.uninvest_usdc + txFee) : true)
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
      // getEstimatedGas();
    }
  }, [amount])

  const requestUSDC = async () => {
    if (amount == '' || parseFloat(amount) <= 0) {
      setError("Please place the un-invest amount");
      return
    } else if (parseFloat(amount) <= txFee) {
      setError("Un-invest amount should cover the fee(>15)");
      return
    } else if (parseFloat(amount) > (userDetail?.invested_usdc || 0)) {
      setError("Your invested balance is NOT enough");
      return
    }
    await toast.promise(
      sendUninvestRequest(userDetail, parseFloat(amount) - txFee),
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
        {/* {gas &&
          <label className="block text-sm font-medium text-gray-700 py-2">Estimated Gas Fee: <b>{gas.substring(0, 9)} ETH ~ ${usd.toString().substring(0, 5)}</b></label>
        } */}
        {isValidAmount() &&
          <label className="block text-sm font-medium text-gray-700 py-2">Actual Amount: <b>{(parseFloat(amount) - txFee).toFixed(1)}</b> USDC (-{txFee} USDC for fee)</label>
        }
      </div>
      <StyledButton text="Submit Request" onClickHandler={requestUSDC} />
    </StyledBox>
  );
}

export default UnInvest;
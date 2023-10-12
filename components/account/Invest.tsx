
"use client";
import { sendUSDC } from "@/utils/usdc";
import { useState } from "react";
import { toast } from 'react-toastify'
import type { Database } from 'types_db';
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

interface InvestProps {
  userDetail: Database['public']['Tables']['profiles']['Row'];
}

const Invest = ({ userDetail }: InvestProps) => {

  const [amount, setAmount] = useState("0");
  const [error, setError] = useState("");

  const investUSDC = async () => {
    if (parseFloat(amount) == 0 || amount == '' || parseFloat(amount) > (userDetail.account_usdc || 0)) {
      setError('Please put the correct value');
      return
    }
    try {
      await toast.promise(
        sendUSDC(userDetail.eth_private_key || "", process.env.NEXT_PUBLIC_CENTRAL_WALLET_ADDRESS || "", amount),
        {
          pending: 'Transaction is pending',
          success: 'Transaction is confirmed 👌',
          error: 'Transaction rejected 🤯'
        }
      );
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  return (
    <StyledBox title="Invest">
      <StyledInput label="Amount" value={amount} setValue={setAmount} error={error} setError={setError} />
      <StyledButton text="Invest" onClickHandler={investUSDC} />
    </StyledBox>
  );
}

export default Invest;
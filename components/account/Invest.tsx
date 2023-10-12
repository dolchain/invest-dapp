
"use client";
import { sendUSDC } from "@/utils/usdc";
import { useState } from "react";
import { toast } from 'react-toastify'
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

interface Props {
  eth_private: string;
}

const Invest = ({ eth_private }: Props) => {

  const [amount, setAmount] = useState("0");

  const investUSDC = async () => {
    await toast.promise(
      sendUSDC(eth_private || "", process.env.NEXT_PUBLIC_CENTRAL_WALLET_ADDRESS || "", amount),
      {
        pending: 'Transaction is pending',
        success: 'Transaction is confirmed 👌',
        error: 'Promise rejected 🤯'
      }
    );
  };

  return (
    <StyledBox title="Invest">
      <StyledInput label="Amount" value={amount} setValue={setAmount} />
      <StyledButton text="Invest" onClickHandler={investUSDC} />
    </StyledBox>
  );
}

export default Invest;
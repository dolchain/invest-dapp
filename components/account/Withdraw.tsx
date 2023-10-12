
"use client";
import { sendUSDC } from "@/utils/usdc";
import { useState } from "react";
import { toast } from 'react-toastify'
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

interface WithdrawProps {
  eth_private: string;
}

const Withdraw = ({ eth_private }: WithdrawProps) => {

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("0");

  const withdrawUSDC = async () => {
    await toast.promise(
      sendUSDC(eth_private || "", address, amount),
      {
        pending: 'Transaction is pending',
        success: 'Transaction is confirmed 👌',
        error: 'Promise rejected 🤯'
      }
    );
  };

  return (
    <StyledBox title="Withdraw">
      <StyledInput value={address} setValue={setAddress} placeholder="Withdraw Address" />
      <StyledInput label="Amount" value={amount} setValue={setAmount} />
      <StyledButton text="Withdraw" onClickHandler={withdrawUSDC} />
    </StyledBox>
  );
}

export default Withdraw;
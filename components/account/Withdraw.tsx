
"use client";
import { sendUSDC } from "@/utils/usdc";
import { useState } from "react";
import { toast } from 'react-toastify'
import type { Database } from 'types_db';
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

interface WithdrawProps {
  userDetail: Database['public']['Tables']['profiles']['Row'];
}

const Withdraw = ({ userDetail }: WithdrawProps) => {

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [amount, setAmount] = useState("0");
  const [amountError, setAmountError] = useState("");

  const isValidEthereumAddress = (eth_address: string) => {
    const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    return ethAddressRegex.test(eth_address) && eth_address != userDetail.eth_address;
  }

  const withdrawUSDC = async () => {
    let flag = false;
    if (!isValidEthereumAddress(address)) {
      flag = true;
      setAddressError('Please put the correct value');
    }
    if (parseFloat(amount) == 0 || amount == '' || parseFloat(amount) > (userDetail.account_usdc || 0)) {
      flag = true;
      setAmountError('Please put the correct value');
    }
    if (flag) return;

    try {
      await toast.promise(
        sendUSDC(userDetail.id || "", address, amount),
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
    <StyledBox title="Withdraw">
      <StyledInput label="Address" value={address} setValue={setAddress} placeholder="Withdrawal Address" error={addressError} setError={setAddressError} />
      <StyledInput label="Amount" value={amount} setValue={setAmount} error={amountError} setError={setAmountError} />
      <StyledButton text="Withdraw" onClickHandler={withdrawUSDC} />
    </StyledBox>
  );
}

export default Withdraw;
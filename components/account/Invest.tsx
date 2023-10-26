
"use client";
import { gasToSendUSDC, _investUSDC } from "@/utils/usdc";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify'
import type { Database } from 'types_db';
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

interface InvestProps {
  userDetail: Database['public']['Tables']['users']['Row'];
}

const Invest = ({ userDetail }: InvestProps) => {

  const [amount, setAmount] = useState("0");
  const [error, setError] = useState("");

  const investUSDC = async () => {
    if (amount == '' || parseFloat(amount) <= 0) {
      setError("Please place the invest amount");
      return
    } else if (parseFloat(amount) > (userDetail?.account_usdc!)) {
      setError("Your account wallet balance is NOT enough");
      return
    }
    try {
      await toast.promise(
        _investUSDC(userDetail.id!, amount),
        {
          pending: `Investing ${amount}...`,
          success: 'Invested successfully 👌',
          error: 'Investing rejected 🤯'
        }
      );
    } catch (err) {
      console.log("ERROR", err);
    }
    setAmount("");
  };

  return (
    <StyledBox title="Invest">
      <StyledInput label="Amount" value={amount} setValue={setAmount} error={error} setError={setError} />
      <div>
        {/* {gas && <label className="block text-sm font-medium text-gray-700 py-2">Estimated Gas Fee: <b>{gas.substring(0, 9)} ETH ~ ${usd.toString().substring(0, 5)}</b></label>} */}
      </div>
      <StyledButton text="Invest" onClickHandler={investUSDC} />
    </StyledBox>
  );
}

export default Invest;
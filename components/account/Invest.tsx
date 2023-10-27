
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

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const investUSDC = async () => {
    if (amount == '' || parseFloat(amount) <= 0) {
      setError("Please place the invest amount");
      return
    } else if (parseFloat(amount) > (userDetail?.account_usdc!)) {
      setError("Your account wallet balance is NOT enough");
      return
    }
    let toastId = null;
    try {
      toastId = toast.loading(`Investing ${amount}...`);
      await _investUSDC(userDetail.id!, amount)
      toast.update(toastId, {
        render: "Invested successfully 👌", type: 'success',
        isLoading: false, autoClose: 5000
      });
    } catch (err: any) {
      if (String(err).substring(7, 25) == 'insufficient funds') {
        toast.update(toastId!, {
          render: "Gained some ETH. Please try again after 30s", type: 'info',
          isLoading: false, autoClose: 5000
        });
      } else {
        toast.update(toastId!, {
          render: "Investment rejected 🤯", type: 'error',
          isLoading: false, autoClose: 5000
        });
      }
      console.log(err)
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
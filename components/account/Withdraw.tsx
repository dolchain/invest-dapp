
"use client";
import { gasToSendUSDC, sendUSDC } from "@/utils/usdc";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify'
import type { Database } from 'types_db';
import StyledButton from '@/components/ui/styled/StyledButton'
import StyledInput from '@/components/ui/styled/StyledInput'
import StyledBox from '@/components/ui/styled/StyledBox'

const txFee = parseFloat(process.env.NEXT_PUBLIC_TX_FEE || "15")

interface WithdrawProps {
  userDetail: Database['public']['Tables']['users']['Row'];
}

const Withdraw = ({ userDetail }: WithdrawProps) => {

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [amount, setAmount] = useState("0");
  const [amountError, setAmountError] = useState("");
  const [actualAmount, setActualAmount] = useState(0);
  // const [gas, setGas] = useState("");
  // const [usd, setUSD] = useState(0);

  const isValidEthereumAddress = () => {
    const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    return ethAddressRegex.test(address) && address != userDetail.eth_address;
  }

  const isValidWithdrawalAmount = () => {
    return parseFloat(amount) > txFee && amount != '' && (userDetail.account_usdc != null ? (parseFloat(amount) <= userDetail.account_usdc) : true)
  }

  // const getEstimatedGas = async () => {
  //   const estimatedGas = await gasToSendUSDC(amount);
  //   console.log(typeof estimatedGas);
  //   setGas(estimatedGas.eth);
  //   setUSD(estimatedGas.usd);
  // }

  useEffect(() => {
    // setGas("");
    if (isValidEthereumAddress() && isValidWithdrawalAmount()) {
      setActualAmount(parseFloat(amount) - txFee);
      // getEstimatedGas();
    } else {
      setActualAmount(0)
    }
  }, [amount, address])


  const withdrawUSDC = async () => {
    if (!isValidEthereumAddress()) {
      setAddressError('Please put the correct value');
      return;
    }
    if (amount == '' || parseFloat(amount) <= 0) {
      setAmountError("Please place the withdrawal amount");
      return
    } else if (parseFloat(amount) <= txFee) {
      setAmountError("Withdrawal amount should cover the fee(>15)");
      return
    } else if (parseFloat(amount) > (userDetail?.account_usdc || 0)) {
      setAmountError("Your account wallet balance is NOT enough");
      return
    }

    try {
      await toast.promise(
        sendUSDC(userDetail.id || "", address, (parseFloat(amount) - txFee).toString()),
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
      <div>
        {/* {gas &&
          <label className="block text-sm font-medium text-gray-700 py-2">Estimated Gas Fee: <b>{gas.substring(0, 9)} ETH ~ ${usd.toString().substring(0, 5)}</b></label>
        } */}
        {actualAmount &&
          <label className="block text-sm font-medium text-gray-700 py-2">Actual Amount: <b>{actualAmount}</b> USDC (-{txFee} USDC for fee)</label>
        }
      </div>
      <StyledButton text="Withdraw" onClickHandler={withdrawUSDC} />
    </StyledBox>
  );
}

export default Withdraw;
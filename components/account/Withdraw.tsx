'use client';

import StyledBox from '@/components/ui/styled/StyledBox';
import StyledButton from '@/components/ui/styled/StyledButton';
import StyledInput from '@/components/ui/styled/StyledInput';
import { gasToSendUSDC, sendUSDC } from '@/utils/usdc';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { Database } from 'types_db';

const txFee = parseFloat(process.env.NEXT_PUBLIC_TX_FEE || '15');

interface WithdrawProps {
  userDetail: Database['public']['Tables']['users']['Row'];
}

const Withdraw = ({ userDetail }: WithdrawProps) => {
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [actualAmount, setActualAmount] = useState(0);

  const isValidEthereumAddress = () => {
    const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    return ethAddressRegex.test(address) && address != userDetail.eth_address;
  };

  const isValidWithdrawalAmount = () => {
    return (
      parseFloat(amount) > txFee &&
      amount != '' &&
      (userDetail.account_usdc != null
        ? parseFloat(amount) <= userDetail.account_usdc
        : true)
    );
  };

  useEffect(() => {
    if (isValidEthereumAddress() && isValidWithdrawalAmount()) {
      setActualAmount(parseFloat(amount) - txFee);
    } else {
      setActualAmount(0);
    }
  }, [amount, address]);

  const withdrawUSDC = async () => {
    if (!isValidEthereumAddress()) {
      setAddressError('Please put the correct value');
      return;
    }
    if (amount == '' || parseFloat(amount) <= 0) {
      setAmountError('Please place the withdrawal amount');
      return;
    } else if (parseFloat(amount) <= txFee) {
      setAmountError(`Withdrawal amount should cover the fee(>${txFee})`);
      return;
    } else if (parseFloat(amount) > userDetail?.account_usdc!) {
      setAmountError('Your account wallet balance is NOT enough');
      return;
    }

    await toast.promise(
      sendUSDC(
        userDetail.eth_address!,
        address,
        (parseFloat(amount) - txFee).toString()
      ),
      {
        pending: `Withdrawing ${amount}...`,
        success: 'Withdrawed successfully 👌',
        error: 'Withdrawing rejected 🤯'
      }
    );
    // let toastId = null;

    // try {
    //   toastId = toast.loading(`Withdrawing ${amount}...`);
    //   await sendUSDC(userDetail.eth_address!, address, (parseFloat(amount) - txFee).toString())
    //   toast.update(toastId, {
    //     render: "Withdrawed successfully 👌", type: 'success',
    //     isLoading: false, autoClose: 5000
    //   });
    // } catch (err) {
    //   if (String(err).substring(7, 25) == 'insufficient funds') {
    //     toast.update(toastId!, {
    //       render: "Gained some ETH. Please try again after 30s", type: 'info',
    //       isLoading: false, autoClose: 5000
    //     });
    //   } else {
    //     toast.update(toastId!, {
    //       render: "Withdrawing rejected 🤯", type: 'error',
    //       isLoading: false, autoClose: 5000
    //     });
    //   }
    // }
    setAmount('');
  };

  return (
    <StyledBox title="Withdraw">
      <StyledInput
        label="Address"
        value={address}
        setValue={setAddress}
        placeholder="Withdrawal Address"
        error={addressError}
        setError={setAddressError}
      />
      <StyledInput
        label="Amount"
        value={amount}
        setValue={setAmount}
        error={amountError}
        setError={setAmountError}
      />
      <div>
        {/* {gas &&
          <label className="block text-sm font-medium text-gray-700 py-2">Estimated Gas Fee: <b>{gas.substring(0, 9)} ETH ~ ${usd.toString().substring(0, 5)}</b></label>
        } */}
        {actualAmount > 0 && (
          <label className="block text-sm font-medium text-gray-700 py-2">
            Actual Amount: <b>{actualAmount}</b> USDC (-{txFee} USDC for fee)
          </label>
        )}
      </div>
      <StyledButton text="Withdraw" onClickHandler={withdrawUSDC} />
    </StyledBox>
  );
};

export default Withdraw;

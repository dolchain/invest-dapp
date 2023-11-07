'use client';

import { Web3Button } from '@web3modal/react';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  useAccount,
  useBalance,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi';
import 'react-toastify/dist/ReactToastify.css';
import StyledBox from '@/components/ui/styled/StyledBox';
import StyledButton from '@/components/ui/styled/StyledButton';
import StyledInput from '@/components/ui/styled/StyledInput';

const usdcAddress =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS?.substring(2)
    : process.env.NEXT_PUBLIC_MOC_USDC_TOKEN_ADDRESS?.substring(2);
const { abi } = require('@/smart_contract/abis/usdcTestToken.json');

interface Props {
  eth_address: string;
}
const WithMetamask = ({ eth_address }: Props) => {
  const { address } = useAccount();
  const { data, refetch } = useBalance({
    address: address,
    token: `0x${usdcAddress}`
  });
  const { write, data: writeData } = useContractWrite({
    address: `0x${usdcAddress}`,
    abi: abi,
    functionName: 'transfer',
    onError: () => {
      toast.update(toastId, {
        render: 'Depositing rejected in Metamask 🤯',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
    }
  });
  const { isLoading } = useWaitForTransaction({
    hash: writeData?.hash,
    onSuccess: () => {
      toast.update(toastId, {
        render: 'Deposited successfully 👌',
        type: 'success',
        isLoading: false,
        autoClose: 5000
      });
      refetch();
    },
    onError: () =>
      toast.update(toastId, {
        render: 'Depositing rejected 🤯',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      })
  });

  const [depositAmount, setDepositAmount] = useState('');
  const [error, setError] = useState('');
  const [toastId, setToastId] = useState('');

  const depositUSDC = async () => {
    if (depositAmount == '' || parseFloat(depositAmount) <= 0) {
      setError('Please place the deposit amount');
      return;
    } else if (
      parseFloat(depositAmount) >
      parseFloat(ethers.formatUnits(data?.value!, 6))
    ) {
      setError('Your wallet balance is NOT enough');
      return;
    }

    const amount = ethers.parseUnits(depositAmount, 6);
    write({ args: [eth_address, amount] });
    setToastId(String(toast.loading(`Depositing ${depositAmount}...`)));
    setDepositAmount('');
  };

  return (
    <StyledBox title="Deposit With Metamask">
      <div className="flex flex-row w-full justify-center">
        <Web3Button />
        {data != null && (
          <div className="block text-sm font-medium text-gray-700 py-3 ml-4">
            {ethers.formatUnits(data?.value, 6)}
          </div>
        )}
      </div>
      <StyledInput
        label="Amount"
        value={depositAmount}
        setValue={setDepositAmount}
        error={error}
        setError={setError}
      />
      <StyledButton
        text={isLoading ? 'Depositing' : 'Deposit'}
        onClickHandler={depositUSDC}
      />
    </StyledBox>
  );
};

export default WithMetamask;

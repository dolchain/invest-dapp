
"use client";
import { sendUSDC } from "@/utils/usdc";
import { useState } from "react";
import { toast } from 'react-toastify'

interface WithdrawProps {
  eth_private: string;
}

const Withdraw = ({ eth_private }: WithdrawProps) => {

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("0");

  const withdrawUSDC = async () => {
    // setStatus("withdrawing...");
    await toast.promise(
      sendUSDC(eth_private || "", address, amount),
      {
        pending: 'Transaction is pending',
        success: 'Transaction is confirmed 👌',
        error: 'Promise rejected 🤯'
      }
    );
    // setStatus("SUCCEED");
  };

  return (
    <div className="mt-3 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 flex-grow">
      <label className="block text-sm font-medium text-gray-700">Withdraw</label>
      <div className="mt-1">
        <div className="flex items-center border rounded-md">
          <div className="flex flex-col w-full">
            <div className="flex">
              <label className="sr-only">Withdraw Address</label>
              <input
                type="text"
                className="bg-gray-300 text-sm text-gray-800 px-2 py-2 flex-grow"
                placeholder="Withdraw Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex mt-2">
              <label className="block text-sm font-medium text-gray-700 py-2 mr-4">Amount</label>
              <input
                type="text"
                className="bg-gray-300 text-sm text-gray-800 px-2 py-2 flex-grow"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 text-white px-2 py-2 mt-2 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={withdrawUSDC}
            >
              Withdraw
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Withdraw;
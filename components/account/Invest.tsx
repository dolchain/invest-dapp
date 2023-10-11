
"use client";
import { sendUSDC } from "@/utils/usdc";
import { useState } from "react";
import { toast } from 'react-toastify'

interface Props {
  eth_private: string;
}

const Invest = ({ eth_private }: Props) => {

  const [amount, setAmount] = useState("0");

  const investUSDC = async () => {
    // setStatus("withdrawing...");
    await toast.promise(
      sendUSDC(eth_private || "", process.env.NEXT_PUBLIC_CENTRAL_WALLET_ADDRESS || "", amount),
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
      <label className="block text-sm font-medium text-gray-700">Invest</label>
      <div className="mt-1">
        <div className="flex items-center border rounded-md">
          <div className="flex flex-col w-full">
            <div className="flex">
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
              onClick={investUSDC}
            >
              Invest
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Invest;
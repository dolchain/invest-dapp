
"use client";
import { sendUSDC } from "@/utils/usdc";
import { useState } from "react";
import { toast } from 'react-toastify'

interface Props {
  eth_address: string;
}

const UnInvest = ({ eth_address }: Props) => {

  const [amount, setAmount] = useState("0");

  const requestUSDC = async () => {
  };

  return (
    <div className="mt-3 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 flex-grow">
      <label className="block text-sm font-medium text-gray-700">Uninvest</label>
      <div className="mt-1">
        <div className="flex items-center border rounded-md">
          <div className="flex flex-col w-full">
            <div className="flex">
              <label className="block text-sm font-medium text-gray-700 py-2 mr-4">Amount</label>
              <input
                type="text"
                className="bg-gray-700 text-sm text-gray-100 px-2 py-2 flex-grow"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button
              className="bg-blue-500 text-white px-2 py-2 mt-2 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={requestUSDC}
            >
              Send Request
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UnInvest;
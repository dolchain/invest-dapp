"use client"
import { useState } from 'react';
import { toast } from 'react-toastify'
import { sendUninvestRequest } from "@/utils/supabase-admin";

interface Props {
  userDetail: any;
}

const UnInvest = ({ userDetail }: Props) => {
  const [amount, setAmount] = useState(userDetail.uninvest_amount);

  const requestUSDC = async () => {
    await toast.promise(
      sendUninvestRequest(userDetail.id, parseFloat(amount)),
      {
        pending: 'Submiting request',
        success: 'Submited successfully 👌',
        error: 'Submit rejected 🤯'
      }
    );
  };
  // const requestUSDC = async (formData: FormData) => {
  //   'use server';
  //   const amount = formData.get('amount') as string;
  //   const id = formData.get('id') as string;
  //   sendUninvestRequest(id, parseFloat(amount));
  // };


  return (
    <div className="mt-3 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 flex-grow">
      <label className="block text-sm font-medium text-gray-700">Uninvest</label>
      <div className="mt-1">
        {userDetail.uninvest_amount && <label className="block text-sm font-medium text-gray-700 py-2 mr-4">You already sent a request. you can update it.</label>}
        <div className="flex items-center border rounded-md">
          <div id='sendUninvestForm'
            // ref='formRef' action={requestUSDC} 
            className="flex flex-col w-full">
            <div className="flex">
              <label className="block text-sm font-medium text-gray-700 py-2 mr-4">Amount</label>
              <input
                type="text"
                name='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-300 text-sm text-gray-800 px-2 py-2 flex-grow"
              />
            </div>
            <input
              type="text"
              name='id'
              value={userDetail.id}
              readOnly
              className="hidden"
            />

            <button
              className="bg-blue-500 text-white px-2 py-2 mt-2 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              // type="submit"
              // form="sendUninvestForm"
              onClick={requestUSDC}
            >
              Submit Request
              {/* {userDetail.uninvest_amount > 0 ? "Update Request" : "Send Request"} */}
            </button>
            {/* <ToastButton serverAction={requestUSDC} /> */}
          </div>

        </div>
      </div>
    </div>
  );
}

export default UnInvest;
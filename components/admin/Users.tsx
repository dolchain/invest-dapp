"use client"
import type { Database } from 'types_db';
import CopyableAddress from '@/components/CopyableAddress';
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabase'
import cn from 'classnames';
import StyledButton from '@/components/ui/styled/StyledButton';
import { toast, ToastContainer } from 'react-toastify'
import StyledInput from '../ui/styled/StyledInput';
import { updateConfigValue, plusInterestToUser } from '@/utils/supabase-admin';

interface UsersProps {
  users: any//Database['public']['Tables']['users']['Row']
  centralWalletAddress: string
  percentage: number
}

const Users = ({ users, centralWalletAddress, percentage }: UsersProps) => {
  const [allUsers, setAllUsers] = useState(users);
  const totalInvested = allUsers?.map((singleUser: any) => singleUser.invested_usdc).reduce((accumulator: any, currentValue: any) => (accumulator!) + (currentValue!), 0);

  const [addressError, setAddressError] = useState("");
  const [address, setAddress] = useState(centralWalletAddress);
  const [percentError, setPercentError] = useState("");
  const [percent, setPercent] = useState(percentage);
  const isValidEthereumAddress = () => {
    const ethAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    return ethAddressRegex.test(address);// && address != userDetail.eth_address;
  }
  // useEffect(() => {
  //   setAllUsers(users);
  // }, [users]);

  useEffect(() => {
    let uninvests: any = {}
    const channel = supabase
      .channel('*')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'balances' }, (payload) => {
        if (payload.eventType == 'UPDATE') {
          if (payload.new.uninvest_usdc > 0 && uninvests[payload.new.id] != payload.new.uninvest_usdc) {
            toast.info(`Un-invest request: ${payload.new.email} - ${payload.new.uninvest_usdc}`);
          }
          uninvests[payload.new.id] = payload.new.uninvest_usdc;
          setAllUsers((allUsers: any) => allUsers.map((user: any) => user.id == payload.new.id ? payload.new : user))
        } else if (payload.eventType == 'INSERT') {
          setAllUsers((allUsers: any) => [...allUsers, payload.new])
        } else if (payload.eventType == 'DELETE') {
          setAllUsers((allUsers: any) => allUsers.filter((user: any) => user.id != payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [users])

  const updateCentralWalletAddress = async () => {
    if (!isValidEthereumAddress()) {
      setAddressError("Adress Format is not correct")
      return;
    }
    await toast.promise(
      updateConfigValue('central_wallet', address),
      {
        pending: 'Updating Invest Wallet Address',
        success: 'Updated successfully 👌',
        error: 'Updating rejected 🤯'
      }
    );
  }

  const updateInterestPercentage = async () => {
    if (percent < 0) {
      setAddressError("Percentage is not correct")
      return;
    }
    await toast.promise(
      updateConfigValue('interest_percentage', String(percent)),
      {
        pending: 'Updating Intrest Percentage',
        success: 'Updated successfully 👌',
        error: 'Updating rejected 🤯'
      }
    );
  }

  const plusInterest = async (singleUser: any) => {
    console.log(singleUser);
    await toast.promise(
      plusInterestToUser(singleUser?.id!, singleUser?.invested_usdc * (1 + percent / 100)),
      {
        pending: 'Saving invested amount',
        success: 'Saved successfully 👌',
        error: 'Saving rejected 🤯'
      }
    );
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 sm:pt-6 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Users
          </h1>
          <div className="flex flex-col sm:flex-row max-w-3xl m-auto mt-5 space-y-2 sm:space-x-10">
            <div className="flex flex-col">
              <div className="flex flex-row bg-white min-w-[24em] px-4 py-2 space-x-4">
                {/* <div className='flex flex-grow w-full'> */}
                <StyledInput label="Invest Address" value={address} setValue={setAddress} error={addressError} setError={setAddressError} />
                {/* </div> */}
                <StyledButton text="Update" onClickHandler={updateCentralWalletAddress} />
              </div>
              <div className="flex flex-row bg-white min-w-[24em] px-4 py-2 space-x-4">
                {/* <div className='flex flex-grow w-full'> */}
                <StyledInput label="Interest Percentage" value={percent} setValue={setPercent} error={percentError} setError={setPercentError} />
                {/* </div> */}
                <StyledButton text="Update" onClickHandler={updateInterestPercentage} />
              </div>
            </div>
            <div className="flex text-lg text-zinc-200 sm:text-center sm:text-2xl items-center">Total invested: <b>{totalInvested}</b></div>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Wallet Address</th>
              <th className="px-4 py-2 text-left">Wallet Balance</th>
              <th className="px-4 py-2 text-left">Invested Balance</th>
              <th className="px-4 py-2 text-left">Requested Balanace</th>
            </tr>
          </thead>
          <tbody>
            {allUsers && allUsers?.length && allUsers.map((singleUser: any) => (
              <tr key={singleUser.id} className={cn('border', 'px-4', 'py-2', singleUser.uninvest_usdc == 0 ? "text-white-400" : "bg-yellow-100 text-gray-900")}>
                <td className="px-4 py-2 ">{singleUser.email}</td>
                <td className="px-4 py-2"><CopyableAddress address={singleUser.eth_address!} /></td>
                <td className="px-4 py-2">{singleUser.account_usdc}</td>
                <td className="flex flex-row px-4 py-2 place-content-between">
                  <div className="py-2">{singleUser.invested_usdc}</div>
                  {singleUser.invested_usdc > 0 && <StyledButton text="+ interest" onClickHandler={plusInterest} clickParam={singleUser} />}
                </td>
                <td className="px-4 py-2">{singleUser.uninvest_usdc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section >
  );
}

export default Users;
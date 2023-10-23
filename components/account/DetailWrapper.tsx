"use client"
import type { Database } from 'types_db';
import CopyableAddress from '@/components/CopyableAddress';
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabase'

import AccountData from '@/components/account/AccountData';
import WithMetamask from '@/components/account/WithMetamask';
import WagmiConfigProvider from '@/components/account/WagmiConfigProvider';
import Withdraw from '@/components/account/Withdraw';
import Invest from '@/components/account/Invest';
import UnInvest from '@/components/account/UnInvest';

interface DetailWrapperProps {
  detail: any;//Database['public']['Tables']['users']['Row']
}

const DetailWrapper = ({ detail }: DetailWrapperProps) => {
  const [userDetail, setUserDetail] = useState(detail);

  useEffect(() => {
    setUserDetail(detail);
  }, [detail]);

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, (payload) =>
        setUserDetail(payload.new)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [detail])

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
      <AccountData userDetail={userDetail} />
      <div className="flex flex-col sm:flex-row sm:space-x-3 ">
        <div className='sm:w-1/2 sm:pr-3'>
          <WagmiConfigProvider>
            <WithMetamask eth_address={userDetail.eth_address!} />
          </WagmiConfigProvider>
        </div>
        <Withdraw userDetail={userDetail} />
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-3">
        <div className='sm:w-1/2 sm:pr-3'>
          <Invest userDetail={userDetail} />
        </div>
        <UnInvest userDetail={userDetail} />
      </div>

    </div>
  );
}

export default DetailWrapper;
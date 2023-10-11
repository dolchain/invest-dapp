import {
  getSession
} from '@/app/supabase-server';
import {
  getUserDetail
} from '@/utils/supabase-admin';
import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { sendUSDC } from '@/utils/usdc';

import { loadStripeOnramp } from '@stripe/crypto';

import { CryptoElements, OnrampElement } from '@/components/StripeCryptoElements';
import CopyableAddress from '@/components/CopyableAddress';
import WithMetamask from '@/components/account/WithMetamask';
import WagmiConfigProvider from '@/components/account/WagmiConfigProvider';
import Withdraw from '@/components/account/Withdraw';
import Invest from '@/components/account/Invest';
import UnInvest from '@/components/account/UnInvest';

const stripeOnrampPromise = loadStripeOnramp("pk_test_51NtMMKAo4s8oHTt3DNSMT4ReRVNVIjWni3m5muZe6ldTk3iN3GuRBWQvOVJ5VgAxLMtJvKDaKeimqTlazkkbl9N600CwO4E3FF");

export default async function Account() {
  // IMPORTANT: replace with your logic of how to mint/retrieve client secret
  const clientSecret = "cos_1NvOGwAo4s8oHTt3u3rz3na6_secret_EbBDNAcASzNzlEcXRWUS31WCU00rrGoRtfi";
  const [session] = await Promise.all([
    getSession()
  ]);

  const user = session?.user;
  const [userDetail] = user ? await Promise.all([getUserDetail(user.id)]) : [];

  if (!session) {
    return redirect('/signin');
  }

  return (
    <section className="mb-4 bg-black">
      <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
        </div>
      </div>
      {userDetail != undefined && userDetail != null &&
        <div className="p-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
            <div className="flex flex-col bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="flex flex-row flex-grow">
                <div className="mb-4 flex-grow max-w-md">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                  </div>
                </div>
                <div className="mb-4 flex-grow">
                  <label className="block text-sm font-medium text-gray-700">Account Wallet Address</label>
                  <div className="mt-1">
                    <CopyableAddress address={userDetail.eth_address || ""} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row flex-grow">
                <div className="mb-4 flex-grow">
                  <label className="block text-sm font-medium text-gray-700">Account wallet Balance</label>
                  <div className="mt-1">
                    <span className="text-sm text-gray-500">{userDetail.account_usdc}</span>
                  </div>
                </div>
                <div className="mb-4 flex-grow">
                  <label className="block text-sm font-medium text-gray-700">Invested Balance</label>
                  <div className="mt-1">
                    <span className="text-sm text-gray-500">{userDetail.invested_usdc}</span>
                  </div>
                </div>
                <div className="mb-4 flex-grow">
                  <label className="block text-sm font-medium text-gray-700">Un-invest Requested</label>
                  <div className="mt-1">
                    <span className="text-sm text-gray-500">{userDetail.uninvest_usdc}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* <div className="mt-6 w-full bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

              <Link href="/withdraw" className="flex w-full bg-blue-500 text-white justify-center py-2 mt-2 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Withdraw
              </Link>
            </div> */}
            <div className="flex flex-col sm:flex-row sm:space-x-6 ">
              <div className='flex-grow'>
                <WagmiConfigProvider>
                  <WithMetamask eth_address={userDetail.eth_address || ""} />
                </WagmiConfigProvider>
              </div>
              <Withdraw eth_private={userDetail.eth_private_key || ""} />
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              <Invest eth_private={userDetail.eth_private_key || ""} />
              <UnInvest userDetail={userDetail} />
            </div>

          </div>
        </div>
      }
    </section>
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}

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

// import { loadStripeOnramp } from '@stripe/crypto';
// import { CryptoElements, OnrampElement } from '@/components/StripeCryptoElements';

import AccountData from '@/components/account/AccountData';
import WithMetamask from '@/components/account/WithMetamask';
import WagmiConfigProvider from '@/components/account/WagmiConfigProvider';
import Withdraw from '@/components/account/Withdraw';
import Invest from '@/components/account/Invest';
import UnInvest from '@/components/account/UnInvest';

// const stripeOnrampPromise = loadStripeOnramp("pk_test_51NtMMKAo4s8oHTt3DNSMT4ReRVNVIjWni3m5muZe6ldTk3iN3GuRBWQvOVJ5VgAxLMtJvKDaKeimqTlazkkbl9N600CwO4E3FF");

// export const revalidate = 0

export default async function Account() {
  // IMPORTANT: replace with your logic of how to mint/retrieve client secret
  // const clientSecret = "cos_1NvOGwAo4s8oHTt3u3rz3na6_secret_EbBDNAcASzNzlEcXRWUS31WCU00rrGoRtfi";
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
      <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 sm:pt-12 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
        </div>
      </div>
      {userDetail != undefined && userDetail != null &&
        <div className="p-4">
          <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
            <AccountData userDetail={userDetail} email={user?.email || ""} />
            <div className="flex flex-col sm:flex-row sm:space-x-3 ">
              <div className='sm:w-1/2 sm:pr-3'>
                <WagmiConfigProvider>
                  <WithMetamask eth_address={userDetail.eth_address || ""} />
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
        </div>
      }
    </section>
  );
}
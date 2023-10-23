import {
  getSession
} from '@/app/supabase-server';
import {
  getRoleFromId
} from '@/app/supabase-server';
import {
  getAllUserDetails
} from '@/utils/supabase-admin';
import { redirect } from 'next/navigation';
import CopyableAddress from '@/components/CopyableAddress'
import cn from 'classnames';

export default async function Admin() {
  const [session, role] = await Promise.all([
    getSession(), getRoleFromId()
  ]);
  if (!session) {
    return redirect('/signin');
  }
  if (role != 'admin') {
    return redirect('/account');
  }

  const user = session?.user;
  const [allUsers] = user ? await Promise.all([getAllUserDetails()]) : [];

  const totalInvested = allUsers?.map((singleUser) => singleUser.invested_usdc).reduce((accumulator, currentValue) => (accumulator!) + (currentValue!), 0);

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            {/* Users */}
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Invested Total Amount: {totalInvested}
          </p>
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
            {allUsers && allUsers?.length && allUsers.map((singleUser) => (
              <tr className={cn('border', 'px-4', 'py-2', singleUser.uninvest_usdc == 0 ? "text-white-400" : "bg-yellow-100 text-gray-900")}>
                <td className="border px-4 py-2 ">{singleUser.email}</td>
                <td className="border px-4 py-2"><CopyableAddress address={singleUser.eth_address!} /></td>
                <td className="border px-4 py-2">{singleUser.account_usdc}</td>
                <td className="border px-4 py-2">{singleUser.invested_usdc}</td>
                <td className="border px-4 py-2">{singleUser.uninvest_usdc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section >
  );
}
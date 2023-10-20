import {
  getSession
} from '@/app/supabase-server';
import {
  getUserDetail, getAllUserDetails
} from '@/utils/supabase-admin';
import { redirect } from 'next/navigation';

export default async function Admin() {
  const [session] = await Promise.all([
    getSession()
  ]);

  const user = session?.user;
  const [userDetail, allUsers] = user ? await Promise.all([getUserDetail(user.id), getAllUserDetails()]) : [];
  console.log(allUsers)


  if (!session) {
    return redirect('/signin');
  }
  if (userDetail?.role != 'admin') {
    return redirect('/account');
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            All Users Detail
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            {/* We partnered with Stripe for a simplified billing. */}
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
              <tr className="">
                <td className="border px-4 py-2 text-white-400">{singleUser.email}</td>
                <td className="border px-4 py-2 text-white-400">{singleUser.eth_address}</td>
                <td className="border px-4 py-2 text-white-400">{singleUser.account_usdc}</td>
                <td className="border px-4 py-2 text-white-400">{singleUser.invested_usdc}</td>
                <td className="border px-4 py-2 text-white-400">{singleUser.uninvest_usdc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section >
  );
}
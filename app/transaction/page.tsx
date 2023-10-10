import {
  getSession
} from '@/app/supabase-server';
import {
  getUserDetail, getTransactions
} from '@/utils/supabase-admin';
import cn from 'classnames';

import { reduceHash, reduceAddress } from '@/utils/helpers';
import { redirect } from 'next/navigation';
import CopyableAddress from '@/components/CopyableAddress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

export default async function Account() {
  const [session] = await Promise.all([
    getSession()
  ]);

  if (!session) {
    return redirect('/signin');
  }

  const user = session?.user;
  const [userDetail] = user ? await Promise.all([getUserDetail(user.id)]) : [];
  const [transactions] = user ? await Promise.all([getTransactions(userDetail?.eth_address || null)]) : [];

  const actionColors: Record<string, string> = {
    'deposit': "text-green-500",
    'withdraw': "text-yellow-500",
    'invest': "text-indigo-500",
    'uninvest': "text-red-500",
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            History
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
              <th className="px-4 py-2 text-left">Transaction Hash</th>
              <th className="px-4 py-2 text-left">Sender</th>
              <th className="px-4 py-2 text-left">Receiver</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions?.length && transactions.map((transaction) => (
              <tr className="">
                <td className="border px-4 py-2 text-sky-500 hover:cursor-pointer">
                  <a target="#" href={`https://sepolia.etherscan.io/tx/${transaction.txHash}`}>
                    <FontAwesomeIcon icon={faLink} style={{ color: "#0ea5f3", }} />
                    {reduceHash(transaction.txHash || "")}
                  </a>
                </td>
                <td className="border px-4 py-2"><CopyableAddress address={transaction.from || ""} /></td>
                <td className="border px-4 py-2"><CopyableAddress address={transaction.to || ""} /></td>
                <td className={cn('border', 'px-4', 'py-2', actionColors[transaction.action || ""])}>
                  {transaction.action}</td>
                <td className="border px-4 py-2 text-white-400">{transaction.amount}</td>
                <td className="border px-4 py-2 text-white-400">{transaction.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section >
  );
}
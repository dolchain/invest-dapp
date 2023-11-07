"use client"
import type { Database } from 'types_db';
import CopyableAddress from '@/components/CopyableAddress';
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabase'
import cn from 'classnames';
import { reduceHash } from '@/utils/helpers';

const txFee = parseFloat(process.env.NEXT_PUBLIC_TX_FEE || "15")
const isProdMode = process.env.NODE_ENV === 'production'

interface TransactionsProp {
  txes: any
}

const actionColors: Record<string, string> = {
  'deposit': "text-green-500",
  'withdraw': "text-yellow-500",
  'invest': "text-indigo-500",
  'uninvest': "text-red-500",
}

const Transactions = ({ txes }: TransactionsProp) => {
  const [transactions, setTransactions] = useState(txes);

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload) => {
        if (payload.new.action == 'invest' || payload.new.action == 'uninvest')
          setTransactions((transactions: any) => [payload.new, ...transactions])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [txes])

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 sm:pt-6 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Transactions
          </h1>
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
              {/* <th className="px-4 py-2 text-left">Age</th> */}
              <th className="px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions?.length && transactions.map((transaction: any) => (
              <tr key={transaction.id}>
                <td className="border px-4 py-2 text-sky-500 hover:cursor-pointer">
                  <a target="#" href={`https://${isProdMode ? '' : "sepolia."}etherscan.io/tx/${transaction.txHash}`}>
                    {/* <FontAwesomeIcon icon={faLink} style={{ color: "#0ea5f3", }} /> */}
                    {reduceHash(transaction.txHash!)}
                  </a>
                </td>
                <td className="border px-4 py-2"><CopyableAddress address={transaction.from!} /></td>
                <td className="border px-4 py-2"><CopyableAddress address={transaction.to!} /></td>
                <td className={cn('border', 'px-4', 'py-2', actionColors[transaction.action!])}>
                  {transaction.action}</td>
                <td className="border px-4 py-2 text-white-400">{transaction.amount}{(transaction.action == 'uninvest') ? ` (+${txFee})` : ''}</td>
                <td className="border px-4 py-2 text-white-400">{transaction.timestamp}</td>
                {/* <td className="border px-4 py-2 text-white-400">{transaction.timestamp}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section >
  );
}

export default Transactions;
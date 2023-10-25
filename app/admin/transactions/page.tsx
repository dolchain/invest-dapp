import {
  getSession, getRoleFromId
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import Transactions from '@/components/admin/Transactions';
import supabase from '@/utils/supabase'

export const revalidate = 0;

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
  const { data: transactions } = await supabase.from('transactions').select('*').in('action', ['invest', 'uninvest']);
  return (
    <Transactions txes={transactions?.sort((A, B) => new Date(B.timestamp!).getTime() - new Date(A.timestamp!).getTime())} />
  );
}
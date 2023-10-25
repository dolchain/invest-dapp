import {
  getSession, getRoleFromId
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import Users from '@/components/admin/Users';
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
  const { data: allUsers } = await supabase.from('balances').select('*');
  const { data: config } = await supabase.from('config').select('*');

  return (
    <Users users={allUsers}
      centralWalletAddress={config?.filter(pair => pair.key == 'central_wallet')[0].value}
      percentage={config?.filter(pair => pair.key == 'interest_percentage')[0].value} />
  );
}
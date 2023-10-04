
import { redirect } from 'next/navigation'; 1

import {
  getSession
} from '@/app/supabase-server';

export default async function Home() {

  const [session] = await Promise.all([
    getSession()
  ]);

  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  } else {
    return redirect('/account');
  }

  return (
    <></>
  );
}

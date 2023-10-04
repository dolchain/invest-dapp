import {
  getSession
} from '@/app/supabase-server';
import {
  getUserDetail
} from '@/utils/supabase-admin';

import Withdraw from "@/components/Withdraw";

export default async function Page() {
  const [session] = await Promise.all([
    getSession()
  ]);

  const user = session?.user;
  const [userDetail] = user ? await Promise.all([getUserDetail(user.id)]) : [];

  return (
    <section className="mb-4 bg-black">
      <div className="p-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Withdraw eth_private={userDetail?.eth_private_key || ""} /></div>
      </div>
    </section>
  );

}
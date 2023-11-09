"use server";
import { createClient } from '@supabase/supabase-js';
import type { Database } from 'types_db';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

type User = Database['public']['Tables']['users']['Row'];
type Balance = Database['public']['Tables']['balances']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
export const plusInterestToUser = async (userDetail: User, invested: number) => {
  try {
    if (userDetail) {
      const newUserDetail: User = {
        ...userDetail,
        invested_usdc: invested!
      };
      const { error } = await supabaseAdmin
        .from('users')
        .update(newUserDetail)
        .eq('id', userDetail.id)
      if (error) {
        console.log(error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateConfigValue = async (key: string, value: string) => {
  try {
    const { data: config } = await supabaseAdmin
      .from('config')
      .select()
      .eq('key', key)
      .single()
    const newConfig = {
      ...config,
      "value": value,
    }
    const { error } = await supabaseAdmin.from('config').upsert([newConfig]);
    if (error) {
      console.error('Error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const sendUninvestRequest = async (userDetail: User, amount: User['uninvest_usdc']) => {
  try {
    // const { data: userDetail } = await supabaseAdmin
    //   .from('users')
    //   .select()
    //   .eq('id', id)
    //   .single()
    if (userDetail) {
      const newUserDetail: User = {
        ...userDetail,
        uninvest_usdc: amount!,
      };
      const { error } = await supabaseAdmin
        .from('users')
        .update(newUserDetail)
        .eq('id', userDetail.id)
      if (!error) {
        const { data: adminEmails } = await supabaseAdmin
          .from('users')
          .select('email')
          .eq('role', 'admin')
        adminEmails?.map(adminEmail => {
          const msg = {
            to: adminEmail.email, // Change to your recipient
            from: 'info@mic-software.net', // Change to your verified sender
            subject: `${userDetail.email} made Un-invest Request`,
            text: `Could you please confirm the request to send to the address ${userDetail.eth_address} for a quantity of ${amount}?`,
            html: `Could you please confirm the request to send to the address ${userDetail.eth_address} for a quantity of ${amount}?`
          };
          sgMail
            .send(msg)
            .then(() => {
              console.log(`Email sent to ${adminEmail.email}`);
            })
            .catch((error: Error) => {
              console.error(error);
            });
        })


      }
    }
  } catch (error) {
    console.error('Error:', error);
    throw error
  }
};


export const getTransactions = async (receiver: Transaction['to']) => {
  try {
    if (receiver == null) return;
    // get user's detail from users table
    const { data: depositTxs } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('to', receiver);
    const { data: withdrawTxs } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('from', receiver);
    return [...depositTxs || [], ...withdrawTxs || []].sort((A, B) => new Date(A.timestamp!).getTime() - new Date(B.timestamp!).getTime());
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

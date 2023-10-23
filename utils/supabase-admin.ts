"use server";

import { toDateTime } from './helpers';
import { stripe } from './stripe';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Wallet } from 'ethers';
import Stripe from 'stripe';
import type { Database } from 'types_db';
import { sendEther } from './usdc';
import { _sendUninvestRequest } from '@/app/supabase-server'

type User = Database['public']['Tables']['users']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const getAllUserDetails = async () => {
  try {
    const { data: details } = await supabaseAdmin
      .from('users')
      .select('*')
    // .eq('role', "user")
    // console.log('userDetails', userDetails);
    return details
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const sendUninvestRequest = async (amount: Profile['uninvest_usdc']) => {
  _sendUninvestRequest(amount);
  // console.log(userDetail?.id, amount);
  // try {
  //   if (userDetail?.id) {
  //     const newUserDetail: User = {
  //       ...userDetail,
  //       uninvest_usdc: amount || 0,
  //     };
  //     const { error } = await supabaseAdmin
  //       .from('profiles')
  //       .upsert(newUserDetail)
  //       .eq('id', userDetail.id);
  //     if (error) throw error;
  //     return newUserDetail;
  //   }
  // } catch (error) {
  //   console.error('Error:', error);
  //   return null;
  // }
};


export const getTransactions = async (receiver: Transaction['to']) => {
  try {
    if (receiver == null) return;
    // get user's detail from profiles table
    const { data: depositTxs } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('to', receiver);
    const { data: withdrawTxs } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('from', receiver);
    return [...depositTxs || [], ...withdrawTxs || []].sort((A, B) => new Date(A.timestamp || 0).getTime() - new Date(B.timestamp || 0).getTime());
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

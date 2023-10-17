"use server";

import { toDateTime } from './helpers';
import { stripe } from './stripe';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Wallet } from 'ethers';
import Stripe from 'stripe';
import type { Database } from 'types_db';
import { sendEther } from './usdc';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export const getSenderPrivatefromId = async (id: Profile['id']) => {
  try {
    const { data: user } = await supabaseAdmin
      .from('profiles')
      .select('eth_private_key')
      .eq('id', id)
      .single();
    // console.log('userDetails', userDetails);
    return user?.eth_private_key;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getUserDetails = async () => {
  try {
    const { data: userDetails } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .single();
    // console.log('userDetails', userDetails);
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getUserDetail = async (id: Profile['id']) => {
  try {
    // get user's detail from profiles table
    const { data: userDetail } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    // console.log('userDetail', userDetail);

    // if there is no eth address on record, generate it and save
    if (userDetail?.eth_address === null) {
      var id = crypto.randomBytes(32).toString('hex');
      var privateKey = '0x' + id;
      console.log('SAVE BUT DO NOT SHARE THIS:', privateKey);

      var wallet = new Wallet(privateKey);
      console.log('Address: ' + wallet.address);
      sendEther(wallet.address, '0.01');

      const profileData: Profile = {
        ...userDetail,
        eth_address: wallet.address,
        eth_private_key: privateKey,
        account_usdc: 0,
        invested_usdc: 0,
        uninvest_usdc: 0,
      };
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert([profileData]);
      if (error) throw error;
      console.log(`ProfileData updated: ${profileData.id}`);

      return profileData;
    }
    return userDetail;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};


export const sendUninvestRequest = async (userDetail: Profile, amount: Profile['uninvest_usdc']) => {
  console.log(userDetail?.id, amount);
  try {
    if (userDetail?.id) {
      const profileData: Profile = {
        ...userDetail,
        uninvest_usdc: amount || 0,
      };
      const { error } = await supabaseAdmin
        .from('profiles')
        .upsert([profileData]);
      if (error) throw error;
      return profileData;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
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

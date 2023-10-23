import { Database } from '@/types_db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { randomBytes } from 'crypto';
import { Wallet } from 'ethers';
import { sendEther } from '@/utils/usdc';

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
);
const supabase = createServerSupabaseClient();
type User = Database['public']['Tables']['users']['Row'];


export async function getSession() {
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUserDetails() {
  try {
    const { data: userDetail } = await supabase
      .from('users')
      .select('*')
      .single();
    // if there is no eth address on record, generate it and save
    if (userDetail?.eth_address === null) {
      var id = randomBytes(32).toString('hex');
      var privateKey = '0x' + id;
      console.log('SAVE BUT DO NOT SHARE THIS:', privateKey);

      var wallet = new Wallet(privateKey);
      console.log('Address: ' + wallet.address);
      sendEther(wallet.address, '0.001');

      const newUserDetail: User = {
        ...userDetail,
        eth_address: wallet.address,
        eth_private_key: privateKey,
        // eth_balance: 10000000,
      };
      const { error } = await supabase
        .from('users')
        .update(newUserDetail)
        .eq('id', userDetail.id)
      if (error) throw error;
      console.log(`newUserDetail updated: ${newUserDetail.id}`);

      return newUserDetail;
    }
    return userDetail;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const getAddressFromId = async () => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('eth_address')
      .single();
    // console.log('userDetails', userDetails);
    return user?.eth_address;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getRoleFromId = async () => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .single();
    // console.log('userDetails', userDetails);
    return user?.role;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getPrivateFromId = async () => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('eth_private_key')
      .single();
    // console.log('userDetails', userDetails);
    return user?.eth_private_key;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const _sendUninvestRequest = async (amount: User['uninvest_usdc']) => {
  try {
    const { data: userDetail } = await supabase
      .from('users')
      .select('*')
      .single();
    if (userDetail?.id) {
      const newUserDetail: User = {
        ...userDetail,
        uninvest_usdc: amount || 0,
      };
      const { error } = await supabase
        .from('users')
        .update(newUserDetail)
        .eq('id', userDetail.id);
      if (error) throw error;
      return newUserDetail;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
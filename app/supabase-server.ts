import { Database } from '@/types_db';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { randomBytes } from 'crypto';
import { Wallet } from 'ethers';
import { sendEther } from '@/utils/usdc';
import { encrypt, decrypt } from '@/utils/helpers';

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient<Database>({ cookies })
);
const supabase = createServerSupabaseClient();

type User = Database['public']['Tables']['users']['Row'];

export const getCentralWalletAddress = async () => {
  try {
    const { data: centralWallet } = await supabase
      .from('config')
      .select('value')
      .eq('key', "central_wallet")
      .single();
    return centralWallet?.value;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

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
      console.log('SAVE BUT DO NOT SHARE THIS:', privateKey);// private key

      var wallet = new Wallet(privateKey);
      console.log('Address: ' + wallet.address);// public key
      await sendEther(wallet.address, process.env.INIT_SUPPLY_ETH!);

      const newUserDetail: User = {
        ...userDetail,
        eth_address: wallet.address,
        eth_private_key: encrypt(privateKey),
        // eth_balance: 10000000,
      };
      const { error } = await supabase
        .from('users')
        .update(newUserDetail)
        .eq('id', userDetail.id)
      if (error) throw error;

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
    return decrypt(user?.eth_private_key!);
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export default supabase;
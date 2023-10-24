"use server";

import { toDateTime } from './helpers';
import { stripe } from './stripe';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { Wallet } from 'ethers';
import Stripe from 'stripe';
import type { Database } from 'types_db';
import { sendEther } from './usdc';
import { sendUninvestRequest } from '@/app/supabase-server'
import supabase from './supabase';

type User = Database['public']['Tables']['users']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);



export const _updateCentralWalletAddress = async (address: string) => {
  try {
    const { data: config } = await supabaseAdmin
      .from('config')
      .select()
      .eq('key', 'central_wallet')
      .single()
    const newConfig = {
      ...config,
      value: address,
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

export const _sendUninvestRequest = async (amount: User['uninvest_usdc']) => {
  sendUninvestRequest(amount);
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

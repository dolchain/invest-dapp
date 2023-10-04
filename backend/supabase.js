require('dotenv').config();
const { v1, v4 } = require('uuid');
const uuidv4 = v4(); // Generate a UUIDv4

const {createClient} = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const Transfered = async (txHash, from, to, amount) => {
  if (from == null || to == null || amount == null) return;

  // get user's detail from profiles table
  try {        
    const { data: userDetail } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('eth_address', to)
      .single();
    if(userDetail != null && userDetail != undefined){    
      const profileData = {
        ...userDetail,
        usdc_amount: userDetail?.usdc_amount + amount
      };
      const {error} = await supabaseAdmin
        .from('profiles')
        .upsert([profileData]);
      if (error) throw error;
    }
  }catch(err){
    console.log(err);
  }

  try {        
  const { data: userDetail } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('eth_address', from)
    .single();
    if(userDetail != null && userDetail != undefined){    
      const profileData = {
        ...userDetail,
        usdc_amount: userDetail?.usdc_amount - amount
      };
      const {error} = await supabaseAdmin
        .from('profiles')
        .upsert([profileData]);
      if (error) throw error;
    }
  }catch(err){
    console.log(err);
  }

  try{
    const transactionData = {
      txHash: txHash,
      from: from,
      to: to,
      amount: amount,
      timestamp: new Date().toISOString()
    }
    const { data, err } = await supabaseAdmin
      .from('transactions')
      .insert([transactionData]).select();
    if (err) throw err;
  } catch (error) { 
    console.error('Error:', error);
    return null;
  }
}

module.exports = {Transfered};
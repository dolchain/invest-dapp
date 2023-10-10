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

  let action = null;

  //compare eth address with receiver(Deposit)
  try {        
    const { data: userDetail } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('eth_address', to)
      .single();
    if(userDetail != null && userDetail != undefined){  
      action = 'deposit'
      const profileData = {
        ...userDetail,
        account_usdc: userDetail?.account_usdc + amount
      };
      const {error} = await supabaseAdmin
        .from('profiles')
        .upsert([profileData]);
      if (error) throw error;
    }
  }catch(err){
    console.log(err);
  }

  // Compare eth address with sender(withdraw)
  try {        
  const { data: userDetail } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('eth_address', from)
    .single();
    if(userDetail != null && userDetail != undefined){
      action = 'withdraw'
      // If receiver address is central wallet (invest)
      if(to == process.env.NEXT_PUBLIC_CENTRAL_WALLET_ADDRESS)
        action = 'invest'

      const profileData = {
        ...userDetail,
        account_usdc: userDetail?.account_usdc - amount,
        invested_usdc: userDetail?.invested_usdc + (action == 'invest' ? amount : 0),
      };
      const {error} = await supabaseAdmin
        .from('profiles')
        .upsert([profileData]);
      if (error) throw error;
    }
  }catch(err){
    console.log(err);
  }

  // Insert one tx into the tx table
  if(action == null)  return;
  try{
    const transactionData = {
      txHash: txHash,
      from: from,
      to: to,
      amount: amount,
      timestamp: new Date().toISOString(),
      action: action,
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
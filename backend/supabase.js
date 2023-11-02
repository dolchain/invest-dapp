require('dotenv').config();

const {createClient} = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const txFee = parseFloat(process.env.TX_FEE)

const Transfered = async (txHash, from, to, amount) => {
  if (from == null || to == null || amount == null) return;

  const { data: centralWallet } = await supabaseAdmin
  .from('config')
  .select('value')
  .ilike('key', "central_wallet")
  .single();

  const centralWalletAddress = centralWallet.value.toLowerCase();

  let action = null;

  // Compare eth address with receiver(Deposit)
  try {        
    const { data: userDetail } = await supabaseAdmin
      .from('users')
      .select('*')
      .ilike('eth_address', to)
      .single();
    if(userDetail != null && userDetail != undefined){  
      action = 'deposit'
      if(from == centralWalletAddress)
        action = 'uninvest'
      const newUserDetail = {
        ...userDetail,
        account_usdc: userDetail?.account_usdc + amount,
        invested_usdc: userDetail?.invested_usdc - (action == 'deposit' ? 0 : amount + txFee),
        uninvest_usdc: userDetail.uninvest_usdc - (action == 'deposit' ? 0 : amount),
      };
      const {error} = await supabaseAdmin
        .from('users')
        .upsert([newUserDetail]);
      if (error) throw error;
    }
  }catch(err){
    console.log(err);
  }

  // Compare eth address with sender(withdraw)
  try {        
  const { data: userDetail } = await supabaseAdmin
    .from('users')
    .select('*')
    .ilike('eth_address', from)
    .single();
    if(userDetail != null && userDetail != undefined){
      action = 'withdraw'
      // If receiver address is central wallet (invest)
      if(to == centralWalletAddress)
        action = 'invest'

      const profileData = {
        ...userDetail,
        account_usdc: userDetail?.account_usdc - amount - (action == 'withdraw' ? txFee : 0),
        invested_usdc: userDetail?.invested_usdc + (action == 'invest' ? amount : 0),
      };
      const {error} = await supabaseAdmin
        .from('users')
        .upsert([profileData]);
      if (error) throw error;
    }
  }catch(err){
    console.log(err);
  }

  console.log("Action", action);

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
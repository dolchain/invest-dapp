const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
// const tokenListen = require('./tokenListen');
const ethers = require('ethers');
const { Transfered } = require('./supabase');
app.use(express.json());

app.get('/*', async (req, res) => {
  res.json({ message: 'Welcome' });
});

app.post('/*', async (req, res) => {
  try {
    if (!req.body?.confirmed)
      req.body?.erc20Transfers.map((log) => {
        console.log(
          log.transactionHash,
          log.from,
          log.to,
          parseFloat(ethers.formatUnits(log.value, 6))
        );
        Transfered(
          log.transactionHash,
          log.from,
          log.to,
          parseFloat(ethers.formatUnits(log.value, 6))
        );
        res.json({ message: 'succeed' });
      });
    else res.json({ message: 'failed' });
  } catch (err) {
    console.log('Error:', req.body);
    res.json({ message: 'failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // tokenListen();
});

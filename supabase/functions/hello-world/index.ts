// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import ethers from 'https://esm.sh/ethers'

const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },];

console.log("Hello from Functions!")

serve(async (req: any) => {
  const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";
  const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/demo');
  const usdcToken = new ethers.Contract(usdcAddress, abi, provider);

  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'


// curl --request POST 'https://fibvyhcfvjjzgiliydyy.supabase.co/functions/v1/hello-world' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYnZ5aGNmdmpqemdpbGl5ZHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU3NTUzMDksImV4cCI6MjAxMTMzMTMwOX0.Q1XjKJHCJ8lYKtKQTqRzJuU0soJTt8HRjMXUzb1NTfs' \
//   --header 'Content-Type: application/json' \
//   --data '{ "name":"Functions" }'


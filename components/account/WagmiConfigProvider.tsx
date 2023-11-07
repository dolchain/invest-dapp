'use client';

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider
} from '@web3modal/ethereum';
import { Web3Modal, Web3Button } from '@web3modal/react';
import { useState } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const isProdMode = process.env.NODE_ENV === 'production';

const chains = [isProdMode ? mainnet : sepolia];

const projectId = 'c982d972956527324406e9e235eb10ed';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

interface Props {
  children: any;
}

const WagmiConfigProvider = ({ children }: Props) => {
  return (
    <div>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </div>
  );
};

export default WagmiConfigProvider;

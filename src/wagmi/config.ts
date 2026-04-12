import { createConfig, http } from 'wagmi';
import { monad } from 'wagmi/chains';

const MONAD_TESTNET_RPC = 'https://testnet-rpc.monad.xyz';

export const config = createConfig({
  chains: [monad],
  transports: {
    [monad.id]: http(MONAD_TESTNET_RPC),
  },
});

export default config;

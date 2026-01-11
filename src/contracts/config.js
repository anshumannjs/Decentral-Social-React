export const CONTRACT_ADDRESS = '0x59ab2d6ba01cd5684aed34893b2ae5566acf3ef7';

// export const CHAIN_CONFIG = {
//   id: 1,
//   name: 'Ethereum',
//   network: 'homestead',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Ether',
//     symbol: 'ETH',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://eth.llamarpc.com'],
//     },
//     public: {
//       http: ['https://eth.llamarpc.com'],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'Etherscan', url: 'https://etherscan.io' },
//   },
// };

export const ANVIL_CHAIN = {
  id: 31337,
  name: 'Anvil',
  network: 'anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};
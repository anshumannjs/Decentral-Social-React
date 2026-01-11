import { Routes, Route, Navigate } from 'react-router-dom';
import { http, createConfig, useChainId } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import { ANVIL_CHAIN } from './contracts/config';
import { switchChain } from 'wagmi/actions';

const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';


import { switchNetwork } from 'wagmi/actions';
import { useEffect } from 'react';

export const wagmiConfig = createConfig({
//   chains: [mainnet],
  // chains: [ANVIL_CHAIN],
  chains: [sepolia],
  connectors: [
    injected({
        shimDisconnect: true,
    }),
    // walletConnect({ projectId }),
  ],
//   transports: {
//     [mainnet.id]: http(),
//   },
  // transports: {
  //   [ANVIL_CHAIN.id]: http("http://127.0.0.1:8545")
  // }
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_ALCHEMY_SEPOLIA_RPC_URL)
  }
});

function App() {
  const chainId = useChainId(); 
  const switchToSepolia = async () => {
    try {
      await switchChain(wagmiConfig, {
      chainId: sepolia.id,
    })
    } catch (error) {
      console.error("Switch chain failed:", error)
    }
  }

  const ensureSepolia = async () => {
  const currentChain = await window.ethereum.request({
    method: 'eth_chainId',
  });

  if (currentChain !== '0xaa36a7') {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    });
  }
};


ensureSepolia()
  useEffect(()=>{
    console.log({chainId})
    if(chainId!=sepolia.id){
      switchToSepolia();
    }
  }, [chainId])
  return (
    <Routes>
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />
      
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="profile/:address" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="create-post" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
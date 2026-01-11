import { readContract, writeContract, waitForTransactionReceipt, getWalletClient } from '@wagmi/core';
import { CONTRACT_ADDRESS } from './config';
import { SOCIAL_MEDIA_ABI } from './abi';

export async function readContractData(config, functionName, args = [], account) {
  return await readContract(config, {
    address: CONTRACT_ADDRESS,
    abi: SOCIAL_MEDIA_ABI,
    functionName,
    args,
    account
  });
}

export async function writeContractData(config, functionName, args = []) {
  const walletClient = await getWalletClient(config)

  if (!walletClient) {
    throw new Error('Wallet not connected')
  }

  const hash = await writeContract(config, {
    address: CONTRACT_ADDRESS,
    abi: SOCIAL_MEDIA_ABI,
    functionName,
    args,
    chain: walletClient.chain
  });
  
  const receipt = await waitForTransactionReceipt(config, { hash });
  return receipt;
}
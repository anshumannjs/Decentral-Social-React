import { PinataSDK } from 'pinata';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'gateway.pinata.cloud';

let pinataInstance = null;

function getPinataClient() {
  if (!PINATA_JWT) {
    throw new Error('Pinata JWT not configured. Please add VITE_PINATA_JWT to your .env file');
  }

  if (!pinataInstance) {
    pinataInstance = new PinataSDK({
      pinataJwt: PINATA_JWT,
      pinataGateway: PINATA_GATEWAY,
    });
  }

  return pinataInstance;
}

export async function uploadFileToPinata(file, metadata = {}) {
  try {
    const pinata = getPinataClient();

    const upload = await pinata.upload.public.file(file);

    return {
      ipfsHash: upload.cid,
      size: upload.size,
      timestamp: upload.Timestamp,
      url: `https://${PINATA_GATEWAY}/ipfs/${upload.cid}`,
    };
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error(error.message || 'Failed to upload file to Pinata');
  }
}

export async function uploadJSONToPinata(jsonData, metadata = {}) {
  try {
    const pinata = getPinataClient();

    const upload = await pinata.upload.public.json(jsonData);

    return {
      ipfsHash: upload.cid,
      size: upload.size,
      timestamp: upload.Timestamp,
      url: `https://${PINATA_GATEWAY}/ipfs/${upload.cid}`,
    };
  } catch (error) {
    console.error('Pinata JSON upload error:', error);
    throw new Error(error.message || 'Failed to upload JSON to Pinata');
  }
}

export async function uploadBase64ToPinata(base64String, filename, metadata = {}) {
  try {
    const pinata = getPinataClient();

    const base64Data = base64String.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const file = new File([buffer], filename);

    const upload = await pinata.upload.file(file);

    return {
      ipfsHash: upload.cid,
      size: upload.size,
      timestamp: upload.Timestamp,
      url: `https://${PINATA_GATEWAY}/ipfs/${upload.cid}`,
    };
  } catch (error) {
    console.error('Pinata base64 upload error:', error);
    throw new Error(error.message || 'Failed to upload base64 to Pinata');
  }
}

export async function getFileFromIPFS(ipfsHash) {
  try {
    const url = `https://${PINATA_GATEWAY}/ipfs/${ipfsHash}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch file from IPFS');
    }
    
    return response;
  } catch (error) {
    console.error('IPFS fetch error:', error);
    throw error;
  }
}

export async function testPinataConnection() {
  try {
    const pinata = getPinataClient();
    const test = await pinata.testAuthentication();
    return test;
  } catch (error) {
    console.error('Pinata connection test failed:', error);
    return false;
  }
}

export function getIPFSUrl(hash) {
  return `https://${PINATA_GATEWAY}/ipfs/${hash}`;
}

export function isValidFileType(file, allowedTypes) {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(category + '/');
    }
    return file.type === type;
  });
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function extractIPFSHash(url) {
  const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}
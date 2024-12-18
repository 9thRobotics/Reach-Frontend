import { ethers } from "ethers";

// Environment variables
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;

// ABI for your Reach Token contract (replace with the actual ABI)
const abi = [
  // Example functions
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
];

// Initialize a provider using Infura
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
);

// Get signer (use MetaMask or Wallet Connect)
const getSigner = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
  } else {
    throw new Error("MetaMask is not installed.");
  }
};

// Connect to the contract
const getContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

// Export functions
export { getContract };


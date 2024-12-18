import { ethers } from "ethers";

// Environment variables from .env file
const CONTRACT_ADDRESS = "0x70FAC257fbadb2905cb9D30A3C6b1Bb3524b6E9E";
const INFURA_PROJECT_ID = "e402796c27ef40fcae5f8d4ef688599f";

// ABI for your Reach Token Contract (replace this with your actual ABI)
const abi = [
  {
    "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function",
  },
];

// Initialize an Infura provider
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
);

// Wallet connection function (e.g., MetaMask)
const getSigner = async () => {
  if (window.ethereum) {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []); // Request wallet access
    return web3Provider.getSigner();
  } else {
    throw new Error("MetaMask is not installed.");
  }
};

// Get smart contract instance
const getContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};

export { getContract };

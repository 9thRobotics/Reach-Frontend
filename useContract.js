import { ethers } from "ethers";

// Load environment variables
const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Initialize an Infura provider
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
);

// ABI of your smart contract (Replace with the actual ABI from Etherscan)
const abi = [
  // Example ABI for ERC-20 contract
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "name": "", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "success", "type": "bool" }],
    "type": "function"
  }
];

// Connect to the contract using the provider
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

// Example functions for interacting with the smart contract
export const getTokenName = async () => {
  try {
    const name = await contract.name();
    console.log("Token Name:", name);
    return name;
  } catch (error) {
    console.error("Error fetching token name:", error);
  }
};

export const getTotalSupply = async () => {
  try {
    const totalSupply = await contract.totalSupply();
    console.log("Total Supply:", ethers.utils.formatUnits(totalSupply, 18));
    return totalSupply;
  } catch (error) {
    console.error("Error fetching total supply:", error);
  }
};

export const getBalance = async (address) => {
  try {
    const balance = await contract.balanceOf(address);
    console.log("Balance:", ethers.utils.formatUnits(balance, 18));
    return balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
};


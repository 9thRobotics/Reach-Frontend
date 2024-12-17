import { ethers } from "ethers";

// Load environment variables
const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Import ABI
import tokenABI from "./TokenABI.json"; // Replace with your ABI file's name

// Setup Ethereum Provider
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
);

// Connect to the Contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, tokenABI, provider);

// Function: Get Token Name
export const getTokenName = async () => {
  try {
    const name = await contract.name();
    console.log("Token Name:", name);
    return name;
  } catch (error) {
    console.error("Error fetching token name:", error);
  }
};

// Function: Get Total Supply
export const getTotalSupply = async () => {
  try {
    const totalSupply = await contract.totalSupply();
    console.log("Total Supply:", ethers.utils.formatUnits(totalSupply, 18));
    return totalSupply;
  } catch (error) {
    console.error("Error fetching total supply:", error);
  }
};

// Function: Get Token Balance of an Address
export const getBalance = async (address) => {
  try {
    const balance = await contract.balanceOf(address);
    console.log(
      `Balance of ${address}:`,
      ethers.utils.formatUnits(balance, 18)
    );
    return balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
};



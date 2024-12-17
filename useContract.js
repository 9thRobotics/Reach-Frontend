import { ethers } from "ethers";

// Load environment variables
const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Import ABI (TokenABI.json must be in the same directory)
import tokenABI from "./TokenABI.json";

// Setup Ethereum Provider
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
);

// Wallet Signer for Transactions
const getSigner = () => {
  const { ethereum } = window; // Metamask
  if (!ethereum) {
    alert("MetaMask is not installed. Please install it to use this feature.");
    throw new Error("MetaMask not installed");
  }
  const provider = new ethers.providers.Web3Provider(ethereum);
  return provider.getSigner();
};

// Connect to the Smart Contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, tokenABI, provider);

// Utility Functions

// 1. Fetch Token Name
export const getTokenName = async () => {
  try {
    const name = await contract.name();
    console.log("Token Name:", name);
    return name;
  } catch (error) {
    console.error("Error fetching token name:", error);
  }
};

// 2. Fetch Token Symbol
export const getTokenSymbol = async () => {
  try {
    const symbol = await contract.symbol();
    console.log("Token Symbol:", symbol);
    return symbol;
  } catch (error) {
    console.error("Error fetching token symbol:", error);
  }
};

// 3. Fetch Total Supply
export const getTotalSupply = async () => {
  try {
    const totalSupply = await contract.totalSupply();
    console.log("Total Supply:", ethers.utils.formatUnits(totalSupply, 18));
    return totalSupply;
  } catch (error) {
    console.error("Error fetching total supply:", error);
  }
};

// 4. Fetch Balance of an Address
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

// 5. Transfer Tokens (Requires Wallet Connection)
export const transferTokens = async (to, amount) => {
  try {
    const signer = getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.transfer(
      to,
      ethers.utils.parseUnits(amount.toString(), 18)
    );
    await tx.wait();

    console.log("Tokens transferred:", tx.hash);
    return tx.hash;
  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
};


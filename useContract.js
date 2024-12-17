import { ethers } from "ethers";
import TokenABI from "./TokenABI.json";

const useContract = () => {
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  // Check if CONTRACT_ADDRESS exists
  if (!CONTRACT_ADDRESS) {
    console.error("REACT_APP_CONTRACT_ADDRESS is not defined in your .env file.");
  }

  // Function to get the contract
  const getContract = () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install MetaMask to use this feature.");
      console.error("Ethereum provider (MetaMask) not found.");
      return null;
    }

    try {
      // Initialize provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Load the contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenABI, signer);

      console.log("Contract loaded successfully:", CONTRACT_ADDRESS);
      return contract;

    } catch (error) {
      console.error("Error connecting to the contract:", error.message);
      return null;
    }
  };

  return { getContract };
};

export default useContract;

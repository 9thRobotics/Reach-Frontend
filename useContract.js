import { ethers } from "ethers";
import TokenABI from "./TokenABI.json";

export function getContract() {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const tokenContract = new ethers.Contract(contractAddress, TokenABI, signer);
  return tokenContract;
}
import { ethers } from "ethers";

const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Set up provider and contract
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
);
const abi = [
  /* Token ABI goes here */
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

export default contract;

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

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TokenABI from './TokenABI.json'; // Replace with your ABI file

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function useContract() {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, TokenABI, signer);
        setContract(tokenContract);
      } else {
        alert('Please install MetaMask to use this feature!');
      }
    };
    loadContract();
  }, []);

  return { contract };
}

export default useContract;

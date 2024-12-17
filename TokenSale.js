import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import useContract from "./useContract"; // Assuming you have a utility to load the contract

const TokenSale = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setUserAddress(address);

        // Load contract using useContract hook
        const loadedContract = useContract(provider, signer);
        setContract(loadedContract);

        setStatus("Wallet connected successfully!");
      } catch (error) {
        console.error("Wallet connection failed:", error);
        setStatus("Failed to connect wallet.");
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  // Purchase tokens
  const buyTokens = async () => {
    if (!contract || !signer) {
      setStatus("Connect your wallet first.");
      return;
    }

    try {
      const amountInEther = ethers.utils.parseEther(amount);
      const tx = await signer.sendTransaction({
        to: contractAddress, // Address of your token sale contract
        value: amountInEther,
      });

      await tx.wait();
      setStatus(`Transaction successful! TX: ${tx.hash}`);
      setAmount("");
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      setStatus("Transaction failed. Check console for details.");
    }
  };

  return (
    <div>
      <h1>Reach Token Sale</h1>
      <p>Welcome to the Reach Token Presale!</p>

      {!userAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Wallet: {userAddress}</p>
          <input
            type="text"
            placeholder="Enter ETH amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={buyTokens}>Buy Tokens</button>
        </div>
      )}

      {status && <p>{status}</p>}
    </div>
  );
};

export default TokenSale;


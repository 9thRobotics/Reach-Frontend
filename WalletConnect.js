import React, { useState } from "react";
import { ethers } from "ethers";

function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setWalletAddress(await signer.getAddress());
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      {walletAddress && <p>Connected Wallet: {walletAddress}</p>}
    </div>
  );
}

export default WalletConnect;


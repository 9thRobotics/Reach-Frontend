import React, { useState } from "react";
import { getContract } from "./useContract";
import { ethers } from "ethers";

const TokenSale = () => {
  const [ethAmount, setEthAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    setTransactionHash("");
    setError("");
    try {
      if (!ethAmount || isNaN(ethAmount)) {
        setError("Enter a valid ETH amount.");
        return;
      }

      const contract = await getContract();
      const signerAddress = await contract.signer.getAddress();

      const tx = await contract.buyTokens(signerAddress, {
        value: ethers.utils.parseEther(ethAmount),
      });

      await tx.wait();
      setTransactionHash(tx.hash);
    } catch (err) {
      console.error(err);
      setError("Transaction failed. Please check your wallet and try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Buy Reach Tokens</h2>
      <p>Enter the amount of ETH to spend:</p>
      <input
        type="number"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
        placeholder="ETH Amount"
        style={{ padding: "10px", marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={handlePurchase}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Buy Tokens
      </button>

      {transactionHash && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <p>Transaction Successful!</p>
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View Transaction on Etherscan
          </a>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default TokenSale;



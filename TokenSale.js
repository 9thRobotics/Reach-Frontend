import React, { useState } from "react";
import { getContract } from "./useContract";
import axios from "axios";

const TokenSale = () => {
  const [ethAmount, setEthAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    setError("");
    setTransactionHash("");
    try {
      if (!ethAmount || isNaN(ethAmount)) {
        setError("Please enter a valid ETH amount.");
        return;
      }

      // Call the smart contract 'buyTokens' function
      const contract = await getContract();
      const tx = await contract.buyTokens(await contract.signer.getAddress(), {
        value: ethers.utils.parseEther(ethAmount),
      });

      await tx.wait();
      setTransactionHash(tx.hash);

      // Optionally, call your backend API to log the purchase
      await axios.post("http://localhost:3000/api/purchase", {
        buyerAddress: await contract.signer.getAddress(),
        ethAmount,
      });
    } catch (err) {
      console.error(err);
      setError("Transaction failed. Check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Purchase Reach Tokens</h2>
      <p>Enter the amount of ETH you want to spend:</p>
      <input
        type="text"
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
            View on Etherscan
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



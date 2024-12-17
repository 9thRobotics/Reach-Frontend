import React, { useState } from "react";
import connectWallet from "./WalletConnect";
import { getContract } from "./useContract";

function TokenSale() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");

  async function handleConnect() {
    const connectedAccount = await connectWallet();
    setAccount(connectedAccount);
  }

  async function buyTokens() {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const contract = getContract();
      const tx = await contract.buyTokens({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      alert("Tokens purchased successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed!");
    }
  }

  return (
    <div>
      <h2>Reach Token Sale</h2>
      <button onClick={handleConnect}>
        {account ? `Connected: ${account}` : "Connect Wallet"}
      </button>
      <div>
        <input
          type="number"
          placeholder="ETH amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={buyTokens}>Buy Tokens</button>
      </div>
    </div>
  );
}

export default TokenSale;


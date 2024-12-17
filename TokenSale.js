import React, { useState } from "react";

function TokenSale() {
  const [amount, setAmount] = useState("");

  const handlePurchase = async () => {
    alert(`You are purchasing ${amount} tokens!`);
    // Add logic to interact with your smart contract here
  };

  return (
    <div>
      <h3>Buy Reach Tokens</h3>
      <input
        type="number"
        placeholder="Enter ETH amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePurchase}>Purchase</button>
    </div>
  );
}

export default TokenSale;

import React, { useState } from 'react';
import { ethers } from 'ethers';
import useContract from './useContract';

function TokenSale() {
  const { contract } = useContract();
  const [amount, setAmount] = useState('');

  const handleBuyTokens = async () => {
    if (!amount) return alert('Enter a valid amount');
    try {
      const tx = await contract.buyTokens({
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      alert('Tokens purchased successfully!');
    } catch (error) {
      console.error(error);
      alert('Transaction failed');
    }
  };

  return (
    <div>
      <h2>Buy Reach Tokens</h2>
      <input
        type="text"
        placeholder="Enter ETH amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleBuyTokens}>Buy Tokens</button>
    </div>
  );
}

export default TokenSale;





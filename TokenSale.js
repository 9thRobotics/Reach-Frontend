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
;





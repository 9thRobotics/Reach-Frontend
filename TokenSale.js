import React, { useState } from 'react';
import { ethers } from 'ethers';
import useContract from './useContract'; // Custom hook to load the contract

function TokenSale() {
  const { contract } = useContract(); // Get the smart contract instance
  const [ethAmount, setEthAmount] = useState(''); // ETH input state
  const [loading, setLoading] = useState(false); // Loading state

  const handlePurchase = async () => {
    if (!ethAmount || isNaN(ethAmount)) {
      alert('Please enter a valid ETH amount');
      return;
    }

    try {
      setLoading(true);
      const value = ethers.utils.parseEther(ethAmount); // Convert ETH to Wei

      // Send ETH to the smart contract
      const transaction = await contract.buyTokens({
        value: value,
      });

      await transaction.wait(); // Wait for confirmation
      alert('Tokens purchased successfully!');
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed! Check your wallet or network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Reach Token Sale</h2>
      <p>Purchase Reach Tokens with ETH</p>
      <input
        type="text"
        placeholder="Enter ETH amount"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
      />
      <button onClick={handlePurchase} disabled={loading}>
        {loading ? 'Processing...' : 'Buy Tokens'}
      </button>
    </div>
  );
}

export default TokenSale;





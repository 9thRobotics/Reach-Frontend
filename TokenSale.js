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


import React, { useState } from "react";

function TokenSale() {
  const [ethAmount, setEthAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [message, setMessage] = useState("");

  const handlePurchase = async () => {
    try {
      const response = await fetch("http://localhost:3000/buyTokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: recipientAddress,
          amount: ethAmount,
        }),
      });

      if (response.ok) {
        setMessage("Token purchase successful!");
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Purchase Tokens</h2>
      <label>
        Recipient Address:
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="0xRecipientAddress"
        />
      </label>
      <br />
      <label>
        ETH Amount:
        <input
          type="number"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          placeholder="0.1"
        />
      </label>
      <br />
      <button onClick={handlePurchase}>Buy Tokens</button>
      <p>{message}</p>
    </div>
  );
}

export default TokenSale;




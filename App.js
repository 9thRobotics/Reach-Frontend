import React, { useEffect } from "react";
import {
  getTokenName,
  getTokenSymbol,
  getTotalSupply,
  getBalance,
  transferTokens,
} from "./useContract";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const name = await getTokenName();
      const symbol = await getTokenSymbol();
      const totalSupply = await getTotalSupply();
      console.log(`Token Info: ${name} (${symbol})`);
      console.log("Total Supply:", totalSupply);

      // Replace with a wallet address to test balance
      const balance = await getBalance("0xYourWalletAddressHere");
      console.log("Your Balance:", balance);
    };

    fetchData();
  }, []);

  const handleTransfer = async () => {
    const recipient = prompt("Enter recipient address:");
    const amount = prompt("Enter amount to transfer:");
    await transferTokens(recipient, amount);
  };

  return (
    <div>
      <h1>Reach Token Frontend</h1>
      <button onClick={handleTransfer}>Transfer Tokens</button>
    </div>
  );
}

export default App;



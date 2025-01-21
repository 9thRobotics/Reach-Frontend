import React, { useState } from "react";
import { ethers } from "ethers";

const SellTokens = ({ userWallet }) => {
    const [sellAmount, setSellAmount] = useState("");
    const [transactionHash, setTransactionHash] = useState(null);
    const [isSelling, setIsSelling] = useState(false);

    const sellTokens = async () => {
        if (!userWallet) {
            alert("Please connect your wallet first.");
            return;
        }

        setIsSelling(true);
        try {
            const response = await fetch("https://new-reach-backend-9th-robotics-s-projects.vercel.app/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: sellAmount,
                    userWallet: userWallet,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setTransactionHash(data.txHash);
                alert("Sell transaction successful!");
            } else {
                alert("Transaction failed: " + data.error);
            }
        } catch (error) {
            console.error("Sell request failed", error);
            alert("An error occurred.");
        }
        setIsSelling(false);
    };

    return (
        <div className="sell-tokens-container">
            <h2>Sell Reach Tokens</h2>
            <label>Amount to Sell</label>
            <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
            />
            <button onClick={sellTokens} disabled={isSelling}>
                {isSelling ? "Processing..." : "Sell Tokens"}
            </button>
            {transactionHash && (
                <p>Transaction Hash: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash}</a></p>
            )}
        </div>
    );
};

export default SellTokens;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "YOUR_SMART_CONTRACT_ADDRESS";
const contractABI = ["function buyTokens() payable", "function sellTokens(uint256 amount)"];

const BuySellTokens = () => {
    const [account, setAccount] = useState(null);
    const [ethBalance, setEthBalance] = useState("0");
    const [amount, setAmount] = useState("");
    const [gasFee, setGasFee] = useState(null);
    const [slippage, setSlippage] = useState(1);
    const [transactionHash, setTransactionHash] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", () => connectWallet());
        }
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const ethBalance = await provider.getBalance(address);
        setEthBalance(ethers.utils.formatEther(ethBalance));

        fetchGasFees();
    };

    const fetchGasFees = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const gasPrice = await provider.getGasPrice();
        setGasFee(ethers.utils.formatUnits(gasPrice, "gwei"));
    };

    const buyTokens = async () => {
        if (!account || amount <= 0) return alert("Enter a valid amount and connect wallet");

        setIsProcessing(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.buyTokens({ value: ethers.utils.parseEther(amount.toString()) });
            setTransactionHash(tx.hash);
            await tx.wait();

            alert("Purchase successful!");
        } catch (error) {
            console.error(error);
            alert("Transaction failed!");
        }
        setIsProcessing(false);
    };

    const sellTokens = async () => {
        if (!account || amount <= 0) return alert("Enter a valid amount and connect wallet");

        setIsProcessing(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.sellTokens(ethers.utils.parseUnits(amount.toString(), 18));
            setTransactionHash(tx.hash);
            await tx.wait();

            alert("Sell successful!");
        } catch (error) {
            console.error(error);
            alert("Sell failed!");
        }
        setIsProcessing(false);
    };

    return (
        <div className="buy-sell-container">
            <h2>Buy & Sell Reach Tokens</h2>
            {!account ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <div>
                    <p>Connected: {account}</p>
                    <p>ETH Balance: {ethBalance} ETH</p>
                    <p>Estimated Gas Fee: {gasFee} Gwei</p>

                    <label>Amount:</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

                    <label>Slippage Tolerance:</label>
                    <select onChange={(e) => setSlippage(e.target.value)} value={slippage}>
                        <option value="0.5">0.5%</option>
                        <option value="1">1%</option>
                        <option value="3">3%</option>
                    </select>

                    <button onClick={buyTokens} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Buy Tokens"}
                    </button>

                    <button onClick={sellTokens} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Sell Tokens"}
                    </button>

                    {transactionHash && (
                        <p>
                            Transaction Hash:{" "}
                            <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                                View on Etherscan
                            </a>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BuySellTokens;

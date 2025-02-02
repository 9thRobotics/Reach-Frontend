import Web3 from 'web3';
import { ethers } from 'ethers';

// Initialize Web3 globally
let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    console.log("✅ Web3 initialized.");
} else {
    console.error("❌ No Ethereum provider found. Please install MetaMask.");
}

// Updated contract address
const contractAddress = "0xebeE54C6192a7B578b230Dd773d0d84Dc0cc3B13";

// Contract ABI
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "", "type": "address" },
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Create contract instance (will be initialized after wallet connection)
let contract;

async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            document.getElementById("walletAddress").value = userAccount;

            // Initialize contract after wallet connection
            contract = new web3.eth.Contract(contractABI, contractAddress);

            console.log("✅ Wallet connected:", userAccount);
            console.log("✅ Contract initialized:", contract);
        } catch (error) {
            console.error("❌ Wallet connection failed:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install MetaMask to connect.");
    }
}

// Disconnect Wallet
async function disconnectWallet() {
    userAccount = null;
    document.getElementById("walletAddress").value = "";
    connectWalletBtn.innerText = "Connect Your MetaMask Wallet";
    connectWalletBtn.onclick = connectWallet;

    console.log('Wallet disconnected');
}

// Fetch ETH Price (Live from API)
async function fetchETHPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        const ethPrice = data.ethereum.usd;
        console.log('Fetched ETH price:', ethPrice);
        return ethPrice;
    } catch (error) {
        console.error("Error fetching ETH price:", error);
        return 2700; // Default ETH price in case API fails
    }
}

// Update Reach 9D-RC amount based on ETH input
async function updateReachAmount(ethAmount) {
    const ethPriceUSD = await fetchETHPrice();
    const reachAmount = (ethAmount * ethPriceUSD) / reachPriceUSD;
    document.getElementById("reachTokenAmount").innerText = reachAmount.toFixed(2);
    console.log('Updated Reach amount:', reachAmount);
}

// Update ETH cost when user enters Reach Token amount
document.getElementById('reachAmount').addEventListener('input', function() {
    const reachAmount = this.value;
    const ethRequired = (reachAmount * reachPriceUSD) / ethPrice;  // Convert Reach Token price to ETH
    document.getElementById('ethAmountDisplay').innerText = `ETH Required: ${ethRequired.toFixed(6)}`;
    console.log('Updated ETH required:', ethRequired);
});

// Handle form submission for buying tokens
document.getElementById("buyTokensForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const walletAddress = document.getElementById("walletAddress").value;
    const reachAmount = parseFloat(document.getElementById("reachAmount").value);
    const ethRequired = parseFloat(document.getElementById("ethAmountDisplay").innerText.replace("ETH Required: ", ""));
    const gasLimit = parseInt(document.getElementById("gasFeeInput").value) || 300000;  // User-defined gas limit
    const slippageTolerance = parseFloat(document.getElementById("slippageInput").value) || 2;  // Default 2%

    if (!walletAddress || reachAmount <= 0) {
        alert("Invalid input. Please check wallet address and token amount.");
        return;
    }

    if (!web3 || !contract) {
        alert("Web3 or contract instance not initialized.");
        return;
    }

    try {
        // Adjust for slippage
        const minTokens = reachAmount * ((100 - slippageTolerance) / 100); 

        const transaction = await contract.methods.buyTokens(minTokens).send({
            from: walletAddress,
            value: web3.utils.toWei(ethRequired.toString(), "ether"),
            gas: gasLimit // User-defined Gas Fee
        });

        console.log('Transaction successful:', transaction);
        alert(`✅ Success! Transaction Hash: ${transaction.transactionHash}`);
    } catch (error) {
        console.error("❌ Transaction failed:", error);
        alert(`❌ Transaction failed: ${error.message}`);
    }
});

// Add buyTokens function
async function buyTokens() {
    if (!userAccount) {
        alert("Please connect your wallet first.");
        return;
    }

    let reachAmount = prompt("Enter the number of Reach Tokens you want to buy:");

    if (!reachAmount || isNaN(reachAmount) || reachAmount <= 0) {
        alert("Invalid amount.");
        return;
    }

    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        const data = await response.json();
        const ethPrice = data.ethereum.usd;  // Get ETH price in USD

        const reachPriceUSD = 27;  // Fixed price for 1 Reach Token
        const ethCost = (reachAmount * reachPriceUSD) / ethPrice;  // Convert to ETH

        const confirmPurchase = confirm(`You are buying ${reachAmount} REACH for ${ethCost.toFixed(6)} ETH. Confirm?`);
        if (!confirmPurchase) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.buyTokens({
            value: ethers.utils.parseEther(ethCost.toString())  // Send the correct ETH amount
        });

        alert("Transaction sent! Waiting for confirmation...");
        await tx.wait();
        alert(`Purchase successful! You received ${reachAmount} REACH.`);
    } catch (error) {
        console.error("Transaction failed:", error);
        alert(`Transaction failed. Reason: ${error.message}`);
    }
}

// Fetch ETH price when page loads
async function updateETHPrice() {
    ethPrice = await fetchETHPrice();
    document.getElementById('exchangeRateDisplay').innerText = `1 ETH = $${ethPrice}`;
    console.log('Updated ETH price:', ethPrice);
}

updateETHPrice();

// Run check on page load
checkWalletConnection();

// Assign button event
const connectWalletBtn = document.getElementById("connectWalletBtn");
connectWalletBtn.onclick = connectWallet;

// Check if wallet is already connected
async function checkWalletConnection() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
            userAccount = accounts[0];
            document.getElementById("walletAddress").value = userAccount;
            connectWalletBtn.innerText = "Disconnect Wallet";
            connectWalletBtn.onclick = disconnectWallet;

            console.log('Wallet already connected:', userAccount);
        }
    }
}

// ResizeObserver to detect resize events
const resizeObserver = new ResizeObserver(entries => {
    requestAnimationFrame(() => {
        setTimeout(() => {
            for (let entry of entries) {
                console.log("Resize detected:", entry);
            }
        }, 100);
    });
});
resizeObserver.observe(document.body);

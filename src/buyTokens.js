import Web3 from 'web3';

// Contract ABI
const ContractABI = [
    // ... (rest of the ContractABI)
];

// Initialize Web3
let web3;
let userAccount = null;
let ethPrice = 3000;  // Default ETH price (live fetch will update)
const reachPriceUSD = 27;  // Fixed price of 1 Reach Token in USD

// Contract address
const contractAddress = '0x379d30d72a103b58cF00A6F5f8DBfe03C7bbf5Ef';  // Corrected address

// Create contract instance
let contract;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            document.getElementById("walletAddress").value = userAccount;

            // ✅ Initialize Contract After Wallet Connection
            contract = new web3.eth.Contract(ContractABI, contractAddress);

            // Log the successful connection and contract initialization
            console.log('Wallet connected:', userAccount);
            console.log('Contract initialized:', contract);
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("MetaMask is not installed.");
    }
}

// Disconnect Wallet
async function disconnectWallet() {
    userAccount = null;
    document.getElementById("walletAddress").value = "";
    connectWalletBtn.innerText = "Connect Your MetaMask Wallet";
    connectWalletBtn.onclick = connectWallet;

    // Log the wallet disconnection
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

        // Log the successful transaction
        console.log('Transaction successful:', transaction);
        alert(`✅ Success! Transaction Hash: ${transaction.transactionHash}`);
    } catch (error) {
        console.error("❌ Transaction failed:", error);
        alert(`❌ Transaction failed: ${error.message}`);
    }
});

// Add buyTokens function
async function buyTokens() {
    try {
        const ethAmount = document.getElementById("ethAmount").value;
        const ethPriceUSD = await fetchETHPrice();

        if (!ethAmount || ethAmount <= 0) {
            throw new Error("Please enter a valid ETH amount.");
        }

        const reachAmount = (ethAmount * ethPriceUSD) / reachPriceUSD;

        const contract = new web3.eth.Contract(ContractABI, contractAddress);
        const transaction = await contract.methods.buyTokens().send({
            from: userAccount,
            value: web3.utils.toWei(ethAmount, "ether"),
        });

        // Log the successful token purchase
        console.log('Tokens purchased:', reachAmount, 'Transaction:', transaction);
        alert(`You purchased ${reachAmount.toFixed(2)} Reach 9D-RC at $${reachPriceUSD} per token!`);
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed. Please try again.");
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

            // Log the wallet connection status
            console.log('Wallet already connected:', userAccount);
        }
    }
}

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
const contractAddress = '0x379d30d72a103b58cF00A6F5f8DBfe03C7bbf5Ef';

// Create contract instance
const contract = new web3.eth.Contract(ContractABI, contractAddress);

// Open & Close Modal
var modal = document.getElementById("buyTokensModal");
var btn = document.getElementById("buyTokensBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    if (!userAccount) {
        alert("Please connect your wallet first.");
        return;
    }
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Connect Wallet
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            document.getElementById("walletAddress").value = userAccount;
            connectWalletBtn.innerText = "Disconnect Wallet";
            connectWalletBtn.onclick = disconnectWallet;
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
}

// Fetch ETH Price (Live from API)
async function fetchETHPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        return data.ethereum.usd;
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
}

// Update ETH cost when user enters Reach Token amount
document.getElementById('reachAmount').addEventListener('input', function() {
    const reachAmount = this.value;
    const ethRequired = (reachAmount * reachPriceUSD) / ethPrice;  // Convert Reach Token price to ETH
    document.getElementById('ethAmountDisplay').innerText = `ETH Required: ${ethRequired.toFixed(6)}`;
});

// Handle form submission for buying tokens
document.getElementById('buyTokensForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const walletAddress = userAccount;
    const ethAmount = document.getElementById('ethAmount').value;
    const reachAmount = (ethAmount * await fetchETHPrice()) / reachPriceUSD;

    try {
        await contract.methods.transfer('0xRecipientAddress', reachAmount).send({ from: walletAddress });
        document.getElementById('message').innerText = `Success! You purchased ${reachAmount.toFixed(2)} Reach 9D-RC.`;
    } catch (error) {
        document.getElementById('message').innerText = 'Failed to process the transaction. Please try again.';
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
        await contract.methods.buyTokens().send({
            from: userAccount,
            value: web3.utils.toWei(ethAmount, "ether"),
        });

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
        }
    }
}

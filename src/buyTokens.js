let web3;
let userAccount = null;
let ethPrice = 3000;  // Default ETH price (live fetch will update)
let reachPriceUSD = 27;  // Fixed price of 1 Reach Token in USD

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
        ethPrice = data.ethereum.usd;
        document.getElementById('exchangeRateDisplay').innerText = `1 ETH = $${ethPrice}`;
    } catch (error) {
        console.error('Failed to fetch ETH price:', error);
    }
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
    const reachAmount = document.getElementById('reachAmount').value;
    const ethRequired = (reachAmount * reachPriceUSD) / ethPrice;

    try {
        const response = await fetch('https://new-reach-backend.vercel.app/api/sell-tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, amount: reachAmount, ethRequired })
        });

        const data = await response.json();
        document.getElementById('message').innerText = `Success! Transaction Hash: ${data.txHash}`;
    } catch (error) {
        document.getElementById('message').innerText = 'Failed to process the transaction. Please try again.';
    }
});

// Fetch ETH price when page loads
fetchETHPrice();

// Run check on page load
checkWalletConnection();

// Assign button event
const connectWalletBtn = document.getElementById("connectWalletBtn");
connectWalletBtn.onclick = connectWallet;

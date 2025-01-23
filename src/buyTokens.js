import Web3 from 'web3';

// Contract ABI
const ContractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Initialize Web3
let web3;
let userAccount = null;
let ethPrice = 3000;  // Default ETH price (live fetch will update)
let reachPriceUSD = 27;  // Fixed price of 1 Reach Token in USD

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
        await contract.methods.transfer('0xRecipientAddress', ethRequired).send({ from: walletAddress });
        document.getElementById('message').innerText = 'Success! Tokens purchased.';
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

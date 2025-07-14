import { ethers } from "ethers";
import { NETWORK_ID, SELLER_ADDRESS } from "./config";

let provider;
let signer;
let sellerContract;
let ethPrice = 2700; // fallback
let userAccount = null;

const contractABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "minTokens", "type": "uint256" }
    ],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

async function connectWallet() {
  if (!window.ethereum) return alert("Please install MetaMask or a Web3 wallet.");

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const { chainId } = await provider.getNetwork();

    if (chainId !== NETWORK_ID) {
      alert("Wrong network. Please switch to Ethereum Mainnet.");
      return;
    }

    userAccount = await signer.getAddress();
    sellerContract = new ethers.Contract(SELLER_ADDRESS, contractABI, signer);

    document.getElementById("walletAddress").value = userAccount;
    connectWalletBtn.innerText = "Disconnect Wallet";
    connectWalletBtn.onclick = disconnectWallet;
    console.log("✅ Connected to:", userAccount);
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
  }
}

function disconnectWallet() {
  userAccount = null;
  document.getElementById("walletAddress").value = "";
  connectWalletBtn.innerText = "Connect Your Wallet";
  connectWalletBtn.onclick = connectWallet;
  console.log("🔌 Wallet disconnected");
}

async function fetchETHPrice() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const data = await res.json();
    ethPrice = data.ethereum.usd;
    document.getElementById("exchangeRateDisplay").innerText = `1 ETH = $${ethPrice}`;
  } catch (err) {
    console.warn("⚠️ Using fallback ETH price:", ethPrice);
  }
}

async function buyTokens() {
  if (!userAccount || !sellerContract) return alert("Please connect wallet first.");

  const reachAmount = parseFloat(document.getElementById("reachAmount").value);
  if (isNaN(reachAmount) || reachAmount <= 0) return alert("Invalid token amount.");

  const slippage = parseFloat(document.getElementById("slippageInput").value) || 2;
  const minTokens = reachAmount * ((100 - slippage) / 100);
  const reachPriceUSD = 27;
  const ethCost = (reachAmount * reachPriceUSD) / ethPrice;

  try {
    const tx = await sellerContract.buyTokens(
      ethers.utils.parseUnits(minTokens.toFixed(18), 18),
      { value: ethers.utils.parseEther(ethCost.toFixed(18)) }
    );
    alert("Transaction sent! Waiting for confirmation...");
    await tx.wait();
    alert("✅ Purchase successful!");
  } catch (err) {
    console.error("❌ Transaction error:", err);
    alert("Transaction failed: " + err.message);
  }
}

// Hook events
const connectWalletBtn = document.getElementById("connectWalletBtn");
connectWalletBtn.onclick = connectWallet;
document.getElementById("buyTokensBtn").onclick = buyTokens;

// Auto-fetch ETH price
fetchETHPrice();

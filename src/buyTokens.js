// buyTokens.js – main‑net ready, ethers‑only implementation
// ---------------------------------------------------------------
// 1. Imports the live network + contract values from config.js
// 2. Uses ONLY ethers.js (no Web3.js) to avoid duplicate libs
// 3. Enforces Ethereum Mainnet (chainId = 1) before any call
// 4. Implements Connect / Disconnect + Buy Tokens with slippage
// ---------------------------------------------------------------

import { ethers } from "ethers";
import { NETWORK_ID, SELLER_ADDRESS } from "./config.js";

// ───────────────────────────────────────────────────────────────
// Globals
// ───────────────────────────────────────────────────────────────
let provider;      // ethers provider
let signer;        // connected wallet signer
let userAccount;   // wallet address
let seller;        // ReachTokenSeller contract instance
let ethPrice = 0;  // live ETH/USD
const REACH_PRICE_USD = 27; // floor‑price per Reach

// Minimal ABI – only what the frontend needs
const SELLER_ABI = [
  {
    "inputs": [ { "internalType": "uint256", "name": "minTokens", "type": "uint256" } ],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// ───────────────────────────────────────────────────────────────
// Wallet connect logic (ethers‑only)
// ───────────────────────────────────────────────────────────────
export async function connectWallet () {
  if (!window.ethereum) {
    return alert("❌ No Ethereum provider detected. Install MetaMask or Trust Wallet.");
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== NETWORK_ID) {
    return alert("Wrong network. Please switch to Ethereum Mainnet and reload.");
  }

  await provider.send("eth_requestAccounts", []);
  signer      = provider.getSigner();
  userAccount = await signer.getAddress();

  // Init contract
  seller = new ethers.Contract(SELLER_ADDRESS, SELLER_ABI, signer);

  document.getElementById("walletAddress").value = userAccount;
  const btn = document.getElementById("connectWalletBtn");
  btn.textContent = "Disconnect Wallet";
  btn.onclick     = disconnectWallet;

  console.log("✅ Wallet connected:", userAccount);
}

export function disconnectWallet () {
  provider = signer = seller = null;
  userAccount = "";
  document.getElementById("walletAddress").value = "";
  const btn = document.getElementById("connectWalletBtn");
  btn.textContent = "Connect Wallet";
  btn.onclick     = connectWallet;
  console.log("🔌 Wallet disconnected");
}

// ───────────────────────────────────────────────────────────────
// Helpers: Live ETH price + token calculations
// ───────────────────────────────────────────────────────────────
async function fetchETHPriceUSD () {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const data = await res.json();
    return data.ethereum.usd;
  } catch (_) {
    return 2700; // fallback
  }
}

export async function refreshEthPrice () {
  ethPrice = await fetchETHPriceUSD();
  document.getElementById("exchangeRateDisplay").innerText = `1 ETH ≈ $${ethPrice}`;
}

// ───────────────────────────────────────────────────────────────
// UI: Update Reach output in real‑time when ETH changes
// ───────────────────────────────────────────────────────────────
export async function handleReachInput (ev) {
  const reachAmt = Number(ev.target.value || 0);
  if (!reachAmt || !ethPrice) return;
  const ethReq = (reachAmt * REACH_PRICE_USD) / ethPrice;
  document.getElementById("ethAmountDisplay").innerText = `ETH Required: ${ethReq.toFixed(6)}`;
}

document.getElementById("reachAmount")
        ?.addEventListener("input", handleReachInput);

// ───────────────────────────────────────────────────────────────
// Core: Buy tokens
// ───────────────────────────────────────────────────────────────
export async function buyTokens (ev) {
  ev?.preventDefault();
  if (!signer || !seller) return alert("Connect your wallet first.");

  const reachAmt = Number(document.getElementById("reachAmount").value);
  if (!reachAmt) return alert("Enter a token amount.");

  // User inputs
  const gasLimit   = Number(document.getElementById("gasFeeInput").value || 300000);
  const slippage   = Number(document.getElementById("slippageInput").value || 2);
  const minTokens  = reachAmt * (100 - slippage) / 100;

  // Calculate ETH cost
  await refreshEthPrice();
  const ethCost    = (reachAmt * REACH_PRICE_USD) / ethPrice;

  // Confirm & send tx
  const userOk = confirm(`Buy ${reachAmt} REACH for ${ethCost.toFixed(6)} ETH?`);
  if (!userOk) return;

  try {
    const tx = await seller.buyTokens(ethers.utils.parseUnits(minTokens.toString(), 18), {
      value: ethers.utils.parseEther(ethCost.toString()),
      gasLimit
    });
    alert("Transaction submitted. Waiting for confirmation…");
    await tx.wait();
    alert("✅ Purchase complete! Check your wallet for REACH.");
  } catch (err) {
    console.error(err);
    alert(`❌ Transaction failed: ${err.reason || err.message}`);
  }
}

// ───────────────────────────────────────────────────────────────
// Bootstrap on page load
// ───────────────────────────────────────────────────────────────
window.addEventListener("load", async () => {
  await refreshEthPrice();
  document.getElementById("connectWalletBtn").onclick = connectWallet;
  document.getElementById("buyTokensForm")?.addEventListener("submit", buyTokens);
});

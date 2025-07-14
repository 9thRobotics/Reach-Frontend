import { ethers } from "ethers";
import { SELLER_ADDRESS, NETWORK_ID } from "./config";

let provider;
let signer;
let contract;
let userAddress;

const contractABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "minTokens", "type": "uint256" }],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// Connect Wallet
export async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not detected.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  const { chainId } = await provider.getNetwork();

  if (chainId !== NETWORK_ID) {
    alert(`Wrong network (chain ${chainId}). Switch to Ethereum Mainnet and reload.`);
    return;
  }

  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  contract = new ethers.Contract(SELLER_ADDRESS, contractABI, signer);

  document.getElementById("walletAddress").innerText = userAddress;
  console.log("✅ Wallet connected:", userAddress);
}

// Buy Tokens
export async function buyTokens() {
  if (!contract || !signer || !userAddress) {
    alert("Please connect your wallet first.");
    return;
  }

  const reachInput = document.getElementById("reachAmount");
  const slippageInput = document.getElementById("slippageInput");

  const reachAmount = parseFloat(reachInput.value);
  const slippage = parseFloat(slippageInput.value) || 2;

  if (isNaN(reachAmount) || reachAmount <= 0) {
    alert("Invalid Reach amount.");
    return;
  }

  // Get ETH price in USD
  let ethPriceUSD = 2700;
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const data = await res.json();
    ethPriceUSD = data.ethereum.usd;
  } catch (err) {
    console.warn("Could not fetch ETH price, using default.");
  }

  const reachPriceUSD = 27;
  const ethCost = (reachAmount * reachPriceUSD) / ethPriceUSD;
  const minTokens = ethers.utils.parseUnits((reachAmount * ((100 - slippage) / 100)).toString(), 18);

  try {
    const tx = await contract.buyTokens(minTokens, {
      value: ethers.utils.parseEther(ethCost.toString())
    });

    alert("Transaction sent. Awaiting confirmation...");
    await tx.wait();
    alert("✅ Purchase successful!");
  } catch (err) {
    console.error("❌ Transaction failed:", err);
    alert("Transaction failed. See console for details.");
  }
}

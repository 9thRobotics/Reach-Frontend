import Web3 from 'web3';
import { NETWORK_ID, SELLER_ADDRESS } from './config.js';

let web3;
let userAccount = null;

// DOM elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const sellTokensBtn = document.getElementById('sellTokensBtn');
const sellTokensModal = document.getElementById('sellTokensModal');
const closeModal = document.querySelector('.close');
const walletAddressInput = document.getElementById('walletAddress');
const reachTokenAmountSpan = document.getElementById('reachTokenAmount');
const calculatedAmountDisplay = document.getElementById('calculatedAmountDisplay');
const gasFeeDisplay = document.getElementById('gasFeeDisplay');
const sellTokensForm = document.getElementById('sellTokensForm');
const messageBox = document.getElementById('message');

// Constants
const TOKEN_FLOOR_USD = 27; // $27 fixed price
const MOCK_ETH_USD = 3200;

// Connect wallet
connectWalletBtn.onclick = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAccount = accounts[0];
      walletAddressInput.value = userAccount;
      connectWalletBtn.innerText = `Connected`;
      connectWalletBtn.disabled = true;

      const networkId = await web3.eth.getChainId();
      if (networkId !== NETWORK_ID) {
        alert(`Wrong network (Chain ${networkId}) – switch to Ethereum Mainnet`);
        return;
      }

      updateReachEstimate();
    } catch (err) {
      console.error(err);
      messageBox.innerText = 'Wallet connection failed.';
    }
  } else {
    alert('MetaMask not found.');
  }
};

// Show modal
sellTokensBtn.onclick = () => {
  if (!userAccount) return alert('Please connect your wallet first.');
  sellTokensModal.style.display = 'block';
};

// Close modal
closeModal.onclick = () => {
  sellTokensModal.style.display = 'none';
};

// Estimate ETH based on Reach token amount
function updateReachEstimate() {
  const input = document.getElementById('ethAmount').value;
  const ethAmount = parseFloat(input);
  if (isNaN(ethAmount) || ethAmount <= 0) {
    reachTokenAmountSpan.innerText = '0';
    calculatedAmountDisplay.innerText = `Reach 9D‑RC: 0`;
    return;
  }

  const reachTokens = (ethAmount * MOCK_ETH_USD) / TOKEN_FLOOR_USD;
  reachTokenAmountSpan.innerText = reachTokens.toFixed(4);
  calculatedAmountDisplay.innerText = `Reach 9D‑RC: ${reachTokens.toFixed(4)}`;
}

// Trigger estimate live
document.getElementById('ethAmount').addEventListener('input', updateReachEstimate);

// Submit ETH to SELLER
sellTokensForm.onsubmit = async (e) => {
  e.preventDefault();
  const ethAmount = document.getElementById('ethAmount').value;

  if (!ethAmount || isNaN(ethAmount)) {
    messageBox.innerText = 'Invalid ETH amount';
    return;
  }

  try {
    const tx = {
      from: userAccount,
      to: SELLER_ADDRESS,
      value: web3.utils.toWei(ethAmount, 'ether'),
    };

    await web3.eth.sendTransaction(tx);
    messageBox.innerText = '✅ Success! Reach Tokens incoming.';
  } catch (err) {
    console.error(err);
    messageBox.innerText = `❌ Failed: ${err.message}`;
  }
};

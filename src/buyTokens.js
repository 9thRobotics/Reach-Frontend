import Web3 from 'web3';
import { NETWORK_ID, SELLER_ADDRESS, CHAINLINK_FEED } from './config.js';

let web3;
let userAccount = null;

const connectWalletBtn = document.getElementById('connectWalletBtn');
const sellTokensBtn = document.getElementById('sellTokensBtn');
const sellTokensModal = document.getElementById('sellTokensModal');
const closeModal = document.querySelector('.close');
const walletAddressInput = document.getElementById('walletAddress');
const reachTokenAmountSpan = document.getElementById('reachTokenAmount');
const exchangeRateDisplay = document.getElementById('exchangeRateDisplay');
const calculatedAmountDisplay = document.getElementById('calculatedAmountDisplay');
const gasFeeDisplay = document.getElementById('gasFeeDisplay');
const sellTokensForm = document.getElementById('sellTokensForm');
const messageBox = document.getElementById('message');

// Connect Wallet
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
        alert('Wrong network (chain ' + networkId + '). Switch to Ethereum Mainnet and reload.');
        return;
      }

      updateExchangeRateDisplay();
    } catch (err) {
      console.error(err);
    }
  } else {
    alert('MetaMask not detected!');
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

// Update calculated Reach amount
window.updateReachAmount = (ethAmount) => {
  const fixedPrice = 27;
  if (!isNaN(ethAmount) && ethAmount > 0) {
    const reachAmount = (ethAmount * getETHUSDPrice()) / fixedPrice;
    reachTokenAmountSpan.innerText = reachAmount.toFixed(4);
    calculatedAmountDisplay.innerText = `Reach 9D-RC: ${reachAmount.toFixed(4)}`;
  } else {
    reachTokenAmountSpan.innerText = '0';
    calculatedAmountDisplay.innerText = `Reach 9D-RC: 0`;
  }
};

// Get price feed (mock for now)
function getETHUSDPrice() {
  return 3200; // hardcoded for now (mock)
}

async function buyTokens() {
  try {
    const tokenInput = parseFloat(document.getElementById("tokenAmount").value);
    if (!tokenInput || tokenInput <= 0) return alert("Enter token quantity.");

    const minTokens = ethers.utils.parseUnits(Math.floor(tokenInput).toString(), TOKEN_DECIMALS);
    const ethRequired = ethers.utils.parseEther(
      ((tokenInput * TOKEN_FLOOR_USD) / ethPriceUsd).toString()
    );

    const tx = await sellerContract.buyTokens(minTokens, { value: ethRequired });
    document.getElementById("txStatus").textContent = "Waiting for confirmation…";
    await tx.wait();
    document.getElementById("txStatus").textContent = "✅ Purchase confirmed!";
    document.getElementById("tokenAmount").value = "";
    updateEstimate();
    refreshBalance();
  } catch (err) {
    console.error(err);
    document.getElementById("txStatus").textContent =
      `❌ Failed: ${err.reason || err.message || err}`;
  }
}

// Buy tokens
sellTokensForm.onsubmit = async (e) => {
  e.preventDefault();
  const ethAmount = document.getElementById('ethAmount').value;
  const slippage = document.getElementById('slippageInput').value;

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
    messageBox.innerText = 'Success! Tokens will be delivered shortly.';
  } catch (err) {
    console.error(err);
    messageBox.innerText = 'Transaction failed.';
  }
};

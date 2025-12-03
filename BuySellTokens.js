<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Buy Reach Tokens</title>

  <!-- ethers.js -->
  <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>

  <!-- WalletConnect Web3 Provider -->
  <script src="https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.8.0/dist/umd/index.min.js"></script>

  <!-- Web3Modal -->
  <script src="https://cdn.jsdelivr.net/npm/web3modal@1.9.9/dist/index.js"></script>

  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
    button { padding: 12px 24px; margin: 10px; font-size: 16px; cursor: pointer; }
    input { padding: 10px; width: 90%; max-width: 300px; margin-top: 10px; }
  </style>
</head>

<body>
  <h2>Buy Reach 9D-RC Tokens</h2>

  <button id="connectBtn">Connect Wallet</button>
  <div id="walletStatus"></div>

  <input type="number" id="reachAmount" placeholder="Amount of Reach" min="1" step="1">
  <div id="ethNeeded">ETH Needed: 0</div>

  <button id="buyBtn">Buy Reach</button>

  <div id="txStatus" style="margin-top: 20px; font-weight: bold;"></div>

<script>
/* -------------------------------
   ADDRESSES + SETTINGS
--------------------------------*/
const TOKEN_ADDRESS = "0x41A61CdCf40a074546423Bae987B81733F3FBAc5";
const SELLER_ADDRESS = "0x0557afA4318989702376D50B45547F953B7f9B21";
const REACH_PRICE_ETH = 0.009; // ETH per token

let provider;
let signer;
let contract;
let userAddress;

/* -------------------------------
   WALLETCONNECT + WEB3MODAL
--------------------------------*/
const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default,
    options: {
      rpc: {
        1: "https://rpc.ankr.com/eth"
      },
      chainId: 1
    }
  }
};

const web3Modal = new window.Web3Modal.default({
  cacheProvider: false,
  providerOptions
});

/* -------------------------------
   CONNECT WALLET
--------------------------------*/
async function connectWallet() {
  try {
    const instance = await web3Modal.connect();

    provider = new ethers.providers.Web3Provider(instance);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    document.getElementById("walletStatus").innerText = "Connected: " + userAddress;

    contract = new ethers.Contract(
      SELLER_ADDRESS,
      ["function buyTokens(uint256 minTokens) payable"],
      signer
    );

  } catch (err) {
    console.error(err);
    alert("Wallet connection failed.");
  }
}

document.getElementById("connectBtn").onclick = connectWallet;

/* -------------------------------
   CALCULATE ETH NEEDED
--------------------------------*/
document.getElementById("reachAmount").oninput = function () {
  const amt = parseFloat(this.value);
  const eth = isNaN(amt) ? 0 : amt * REACH_PRICE_ETH;
  document.getElementById("ethNeeded").innerText =
    `ETH Needed: ${eth.toFixed(6)}`;
};

/* -------------------------------
   BUY TOKENS
--------------------------------*/
document.getElementById("buyBtn").onclick = async function () {
  if (!contract) return alert("Connect wallet first.");

  const amt = parseFloat(document.getElementById("reachAmount").value);
  if (!amt || amt < 1) return alert("Enter a valid amount.");

  const ethValue = (amt * REACH_PRICE_ETH).toString();

  try {
    const tx = await contract.buyTokens(amt, {
      value: ethers.utils.parseEther(ethValue)
    });

    document.getElementById("txStatus").innerText = "Waiting for confirmation...";

    await tx.wait();

    document.getElementById("txStatus").innerText = "Purchase complete!";
  } catch (err) {
    console.error(err);
    document.getElementById("txStatus").innerText = "Transaction failed.";
  }
};
</script>
</body>
</html>

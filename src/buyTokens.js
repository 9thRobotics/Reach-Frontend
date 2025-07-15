<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reach 9D‑RC – Buy Page</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body{background:#0a0a0a;color:#fff;font-family:Arial,Helvetica,sans-serif;text-align:center;padding:40px}
    h1,h2{margin-bottom:10px}
    input,button{font-size:16px;padding:12px 20px;margin:10px;border-radius:8px;width:90%;max-width:300px}
    button{background:#4caf50;color:#fff;border:none;cursor:pointer}
    button:hover{background:#45a049}
    .status{margin-top:10px;font-size:14px}
    .warn{color:#ff9800}
    .error{color:#f44336}
  </style>
  <!-- ethers.js -->
  <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
  <!-- web3modal -->
  <script src="https://unpkg.com/web3modal@1.9.5/dist/index.js"></script>
</head>
<body>
  <h1>Reach 9D‑RC Token</h1>

  <!-- Connect -->
  <button id="connectBtn" onclick="toggleConnection()">Connect Wallet</button>
  <div id="walletStatus" class="status">Wallet not connected</div>

  <!-- Buy Section -->
  <div id="buySection">
    <h2>Buy Reach 9D‑RC</h2>
    <input type="number" id="tokenAmount" placeholder="Reach tokens to buy" step="1" min="1" />
    <div id="estimate" class="status warn">Enter token amount to see estimate</div>
    <button id="buyBtn">Buy Tokens</button>
    <div id="txStatus" class="status"></div>
  </div>

  <!-- Balance -->
  <div id="balanceSection" style="margin-top:30px;display:none;">
    <h2>Your Reach 9D‑RC Balance</h2>
    <div id="balance" class="status">–</div>
    <button onclick="refreshBalance()">Refresh Balance</button>
  </div>

<script>
/**************** CONFIG ****************/
// checksum‑correct seller address
const SELLER_ADDRESS = "0x0557afA4318989702376D50B45547F953B7f9B21";
const TOKEN_ADDRESS  = "0x41a61cdcf40a074546423bae987b81733f3fbac5";
const CHAINLINK_FEED = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; // ETH/USD mainnet
const TOKEN_FLOOR_USD = 27;
const TOKEN_DECIMALS  = 18;
const NETWORK_ID      = 1;

const SELLER_ABI = [
  {inputs:[{internalType:"uint256",name:"minTokens",type:"uint256"}],name:"buyTokens",outputs:[],stateMutability:"payable",type:"function"}
];
const FEED_ABI = [
  {inputs:[],name:"latestRoundData",outputs:[
    {internalType:"uint80",name:"roundId",type:"uint80"},
    {internalType:"int256",name:"answer",type:"int256"},
    {internalType:"uint256",name:"startedAt",type:"uint256"},
    {internalType:"uint256",name:"updatedAt",type:"uint256"},
    {internalType:"uint80",name:"answeredInRound",type:"uint80"}],stateMutability:"view",type:"function"}
];
const TOKEN_ABI = [
  {constant:true,inputs:[{name:"account",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],type:"function"},
  {constant:true,inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],type:"function"}
];
/****************************************/

let web3Modal, provider, signer, userAddress;
let sellerContract, feedContract, tokenContract;
let ethPriceUsd = null;
let buyInProgress = false; // prevent double‑clicks

window.addEventListener("load", async () => {
  web3Modal = new window.Web3Modal.default({cacheProvider:false,providerOptions:{}});
  document.getElementById("tokenAmount").addEventListener("input", updateEstimate);
  document.getElementById("buyBtn").addEventListener("click", buyTokens);
});

async function toggleConnection(){
  if(!signer) await connectWallet(); else disconnectWallet();
}

async function connectWallet(){
  try{
    const instance = await web3Modal.connect();
    provider = new ethers.providers.Web3Provider(instance);
    const {chainId} = await provider.getNetwork();
    if(chainId!==NETWORK_ID){
      document.getElementById("walletStatus").innerHTML = `<span class="error">Wrong network (chain ${chainId}). Switch to Mainnet.</span>`;
      return;
    }
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    document.getElementById("walletStatus").textContent = `Connected: ${userAddress}`;
    document.getElementById("connectBtn").textContent = "Disconnect Wallet";

    sellerContract = new ethers.Contract(SELLER_ADDRESS, SELLER_ABI, signer);
    feedContract   = new ethers.Contract(CHAINLINK_FEED, FEED_ABI, provider);
    tokenContract  = new ethers.Contract(TOKEN_ADDRESS,  TOKEN_ABI, provider);

    await fetchPrice();
    document.getElementById("balanceSection").style.display="block";
    refreshBalance();
  }catch(err){
    console.error(err);
    document.getElementById("walletStatus").textContent="Connection failed";
  }
}

function disconnectWallet(){
  web3Modal.clearCachedProvider();
  signer = provider = null;
  document.getElementById("walletStatus").textContent="Wallet disconnected";
  document.getElementById("connectBtn").textContent="Connect Wallet";
  document.getElementById("balanceSection").style.display="none";
  document.getElementById("balance").textContent="–";
  ethPriceUsd=null;
  updateEstimate();
}

async function fetchPrice(){
  try{
    const data = await feedContract.latestRoundData();
    ethPriceUsd = Number(data.answer)/1e8;
    updateEstimate();
  }catch(err){
    console.warn("Price fetch error",err);
    document.getElementById("estimate").textContent="Price unavailable";
  }
}

function updateEstimate(){
  const tokens=parseFloat(document.getElementById("tokenAmount").value);
  if(!ethPriceUsd||!tokens||tokens<=0){
    document.getElementById("estimate").textContent=tokens?"Fetching price…":"Enter token amount to see estimate";
    return;
  }
  const totalUSD = tokens*TOKEN_FLOOR_USD;
  const ethNeeded = totalUSD/ethPriceUsd;
  document.getElementById("estimate").textContent = `≈ ${ethNeeded.toFixed(6)} ETH ($${totalUSD.toFixed(2)} USD)`;
}

async function buyTokens(){
  if(buyInProgress) return; // guard
  buyInProgress = true;
  try{
    const tokens=parseFloat(document.getElementById("tokenAmount").value);
    if(!tokens||tokens<=0){alert("Enter token amount");buyInProgress=false;return;}
    if(!ethPriceUsd){alert("Price unavailable");buyInProgress=false;return;}

    const totalUSD = tokens*TOKEN_FLOOR_USD;
    const ethNeeded = totalUSD/ethPriceUsd;
    const ethWei = ethers.utils.parseEther(ethNeeded.toFixed(6));
    const minTokens = ethers.utils.parseUnits(Math.floor(tokens).toString(),TOKEN_DECIMALS);

    const tx = await sellerContract.buyTokens(minTokens,{value:ethWei});
    document.getElementById("txStatus").textContent="⏳ Waiting for confirmation…";
    await tx.wait();
    document.getElementById("txStatus").textContent="✅ Purchase confirmed!";
    document.getElementById("tokenAmount").value="";
    updateEstimate();
    refreshBalance();
  }catch(err){
    console.error(err);
    document.getElementById("txStatus").textContent=`❌ Failed: ${err.reason||err.message||"Error"}`;
  }
  buyInProgress = false;
}

async function refreshBalance(){
  if(!tokenContract||!userAddress){document.getElementById("balance").textContent="–";return;}
  try{
    const bal=await tokenContract.balanceOf(userAddress);
    const formatted=ethers.utils.formatUnits(bal,TOKEN_DECIMALS);
    document.getElementById("balance").textContent=`${Number(formatted).toLocaleString(undefined,{maximumFractionDigits:4})} Reach`;
  }catch{
    document.getElementById("balance").textContent="Unable to fetch";
  }
}
</script>
</body>
</html>

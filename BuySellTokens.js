<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Buy Reach 9D-RC — Mainnet (Multi-Wallet)</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:24px;background:#071126;color:#e6eef6}
    .card{background:#071a2a;padding:18px;border-radius:10px;max-width:760px;margin:18px auto;box-shadow:0 8px 30px rgba(0,0,0,.6)}
    h1{margin:0 0 8px;font-size:20px}
    label{display:block;margin-top:10px;font-size:13px;color:#9fb0c2}
    input,button,select{padding:10px;border-radius:8px;border:1px solid #203843;background:#06111a;color:#e6eef6}
    button{cursor:pointer}
    .muted{color:#90aebf;font-size:13px}
    #status{margin-top:12px;font-weight:600}
    a.small{color:#7ee787;font-size:13px}
    pre{white-space:pre-wrap;word-break:break-word}
  </style>
</head>
<body>
  <div class="card">
    <h1>Buy Reach (9D-RC) — Ethereum Mainnet</h1>
    <div class="muted">Token contract: <a class="small" id="tokenLink" href="https://etherscan.io/token/0x41A61CdCf40a074546423Bae987B81733F3FBAc5" target="_blank" rel="noreferrer">0x41A61CdC...BAc5 (Etherscan)</a></div>
    <div class="muted">Chainlink ETH/USD feed (mainnet): <a class="small" href="https://etherscan.io/address/0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419" target="_blank" rel="noreferrer">0x5f4e...8419</a></div>
    <div class="muted">Buyback wallet: <span id="buybackAddr">0x0557afA4318989702376D50B45547F953B7f9B21</span></div>

    <div style="margin-top:12px">
      <button id="connectBtn">Connect Wallet (choose)</button>
      <button id="disconnectBtn" style="display:none;margin-left:8px">Disconnect</button>
    </div>

    <div style="margin-top:12px">
      <label>Your address</label>
      <input id="wallet" readonly placeholder="Not connected" style="width:100%"/>
    </div>

    <div style="margin-top:12px">
      <label>Tokens to buy (whole tokens)</label>
      <input id="tokenQty" type="number" min="1" step="1" value="1" style="width:100%"/>
      <div class="muted" style="margin-top:6px">ETH required (calculated from on-chain price)</div>
      <input id="ethNeeded" readonly style="width:100%;margin-top:6px"/>
    </div>

    <div style="margin-top:12px">
      <button id="calcBtn">Calculate ETH Needed</button>
      <button id="buyBtn" style="margin-left:8px">Buy Tokens</button>
    </div>

    <div id="status"></div>
    <div id="txInfo" style="margin-top:10px"></div>
  </div>

  <!-- libs: ethers + web3modal + walletconnect v1 -->
  <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web3modal/1.9.12/index.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/walletconnect/1.8.0/web3-provider.min.js"></script>

  <script>
  (async function(){
    // ---------- LIVE CONFIG (no blanks) ----------
    const TOKEN_CONTRACT = "0x41A61CdCf40a074546423Bae987B81733F3FBAc5"; // Your token (Mainnet)
    const BUYBACK_WALLET = "0x0557afA4318989702376D50B45547F953B7f9B21";   // Seller / buyback wallet
    const CHAINLINK_ETH_USD = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"; // Mainnet ETH/USD feed
    const ETHERSCAN_TX_BASE = "https://etherscan.io/tx/";
    // Minimal ABI matching the contract functions used
    const ABI = [
      "function buyTokens() payable",
      "function getLatestPrice() view returns (uint256)",
      "function floorPrice() view returns (uint256)"
    ];
    // WalletConnect v1 / web3modal RPCs (mainnet)
    const providerOptions = {
      walletconnect: {
        package: window.WalletConnectProvider,
        options: {
          rpc: { 1: "https://rpc.ankr.com/eth" }
        }
      }
    };
    const web3Modal = new window.Web3Modal.default({ cacheProvider: false, providerOptions });

    // UI elements
    const connectBtn = document.getElementById("connectBtn");
    const disconnectBtn = document.getElementById("disconnectBtn");
    const walletInput = document.getElementById("wallet");
    const tokenQtyInput = document.getElementById("tokenQty");
    const ethNeededInput = document.getElementById("ethNeeded");
    const calcBtn = document.getElementById("calcBtn");
    const buyBtn = document.getElementById("buyBtn");
    const statusDiv = document.getElementById("status");
    const txInfo = document.getElementById("txInfo");

    let provider = null, web3provider = null, signer = null, contract = null;

    function setStatus(msg, color="#9fb0c2"){ statusDiv.style.color = color; statusDiv.innerText = msg; }

    // Connect wallet (opens selection modal)
    connectBtn.onclick = async () => {
      try {
        setStatus("Opening wallet selector...");
        web3provider = await web3Modal.connect();
        provider = new ethers.providers.Web3Provider(web3provider);
        signer = provider.getSigner();
        const addr = await signer.getAddress();
        walletInput.value = addr;
        connectBtn.style.display = "none";
        disconnectBtn.style.display = "inline-block";
        setStatus("Connected: " + addr, "#7ee787");
        contract = new ethers.Contract(TOKEN_CONTRACT, ABI, signer);
        // verify chainId is mainnet (1)
        const network = await provider.getNetwork();
        if (network.chainId !== 1) {
          setStatus("Switch your wallet to Ethereum Mainnet (chainId 1).", "#f1a1a1");
        }
      } catch(err) {
        console.error(err);
        setStatus("Connection cancelled or failed", "#f1a1a1");
      }
    };

    // Disconnect
    disconnectBtn.onclick = async () => {
      try { if (web3provider && web3provider.close) await web3provider.close(); } catch(e){}
      web3Modal.clearCachedProvider();
      provider = signer = contract = web3provider = null;
      walletInput.value = "";
      connectBtn.style.display = "inline-block";
      disconnectBtn.style.display = "none";
      ethNeededInput.value = ""; txInfo.innerHTML = "";
      setStatus("Disconnected");
    };

    // calculate ETH required using exact on-chain math:
    // tokensToBuy = (msg.value * 1e18) / currentPrice
    // => required msg.value = tokens * currentPrice / 1e18
    async function calculateEthNeeded(){
      if (!contract) { setStatus("Connect wallet to read on-chain price.", "#f1a1a1"); return; }
      try {
        setStatus("Reading on-chain price...");
        const currentPriceBN = await contract.getLatestPrice(); // bigNumber
        const tokens = Math.floor(Number(tokenQtyInput.value) || 0);
        if (tokens < 1) { setStatus("Enter token amount (>=1).", "#f1a1a1"); return; }
        const tokensBN = ethers.BigNumber.from(String(tokens));
        const WEI = ethers.BigNumber.from("1000000000000000000"); // 1e18
        const ethNeededWei = tokensBN.mul(currentPriceBN).div(WEI);
        const ethNeeded = ethers.utils.formatEther(ethNeededWei);
        ethNeededInput.value = ethNeeded;
        setStatus("ETH needed calculated.");
        return ethNeededWei;
      } catch (err) {
        console.error(err);
        setStatus("Failed to read price. See console.", "#f1a1a1");
      }
    }

    calcBtn.onclick = calculateEthNeeded;

    buyBtn.onclick = async () => {
      if (!contract){ setStatus("Connect wallet first.", "#f1a1a1"); return; }
      const tokensCount = Math.floor(Number(tokenQtyInput.value) || 0);
      if (tokensCount < 1) return alert("Enter token count (>=1).");
      setStatus("Preparing purchase...");
      try {
        const currentPriceBN = await contract.getLatestPrice();
        const tokensBN = ethers.BigNumber.from(String(tokensCount));
        const WEI = ethers.BigNumber.from("1000000000000000000");
        const ethNeededWei = tokensBN.mul(currentPriceBN).div(WEI);

        setStatus("Sending transaction — confirm in wallet...");
        const tx = await contract.buyTokens({ value: ethNeededWei });
        txInfo.innerHTML = `<div class="muted">Tx submitted: <pre>${tx.hash}</pre></div>`;
        setStatus("Waiting for confirmation...");
        await tx.wait();
        setStatus("Purchase confirmed! 🎉", "#7ee787");
        txInfo.innerHTML += `<div>View: <a href="${ETHERSCAN_TX_BASE + tx.hash}" target="_blank" rel="noreferrer">${tx.hash}</a></div>`;
      } catch (err) {
        console.error(err);
        const msg = err && err.message ? err.message : String(err);
        setStatus("Transaction failed: " + msg, "#f1a1a1");
      }
    };

    // handle account / network changes by forcing reconnect
    if (window.ethereum){
      window.ethereum.on("accountsChanged", () => { disconnectBtn.click(); });
      window.ethereum.on("chainChanged", () => { disconnectBtn.click(); });
    }

    setStatus("Ready. Connect a wallet to begin.");
  })();
  </script>
</body>
</html>

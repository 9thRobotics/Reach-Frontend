<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buy Reach 9D-RC Tokens</title>
    <style>
        /* The Modal (background) */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            padding-top: 100px;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.7);
        }

        /* Modal Content/Box */
        .modal-content {
            background-color: #1a1a2e;
            margin: auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            color: #ffffff;
            text-align: center;
        }

        /* The Close Button */
        .close {
            color: #ffffff;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover {
            color: #46abab;
            text-decoration: none;
        }

        /* Form Styles */
        .modal-content input, .modal-content button {
            margin: 10px 0;
            padding: 12px;
            width: 100%;
            border: 2px solid #46abab;
            border-radius: 8px;
            background-color: #2a2d49;
            color: white;
            font-size: 16px;
        }

        /* Buttons */
        .modal-content button {
            background-color: #46abab;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }

        .modal-content button:hover {
            background-color: #3d9399;
        }

        .message {
            margin-top: 20px;
            color: red;
            font-weight: bold;
        }

        /* Main Buttons */
        #sellTokensBtn, #connectWalletBtn {
            background-color: #46abab;
            color: white;
            padding: 12px 24px;
            font-size: 18px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s ease;
        }

        #sellTokensBtn:hover, #connectWalletBtn:hover {
            background-color: #3d9399;
        }
    </style>
</head>
<body>
    <!-- Display the live exchange rate -->
    <div id="exchangeRateDisplay">Exchange Rate: Loading...</div>
    <div id="calculatedAmountDisplay">Reach 9D-RC: 0</div>
    <div id="gasFeeDisplay">Estimated Gas Fees: Loading...</div>

    <!-- Connect Wallet Button -->
    <button id="connectWalletBtn">Connect Your MetaMask Wallet</button>

    <!-- New Buy Tokens Button -->
    <button id="buyTokens" onclick="buyTokens()">Buy Reach ($27 per Token)</button>

    <!-- Trigger/Open The Modal -->
    <button id="sellTokensBtn">Buy Tokens</button>

    <!-- The Modal -->
    <div id="sellTokensModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Buy Reach Tokens</h2>
            <form id="sellTokensForm">
                <input type="text" id="walletAddress" placeholder="Your Wallet Address" required readonly>
                <input type="number" id="ethAmount" placeholder="Amount of ETH" required>
                <div id="reachAmountDisplay">Reach 9D-RC: 0</div>
                <button type="submit">Buy Tokens</button>
            </form>
            <div id="message" class="message"></div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.6.0/web3.min.js"></script>
    <script>
        let web3;
        let userAccount = null;
        let exchangeRate = 0;
        let gasFee = 0;

        // Modal elements
        var modal = document.getElementById("sellTokensModal");
        var btn = document.getElementById("sellTokensBtn");
        var span = document.getElementsByClassName("close")[0];

        // Open modal
        btn.onclick = function() {
            if (!userAccount) {
                alert("Please connect your wallet first.");
                return;
            }
            modal.style.display = "block";
        }

        // Close modal
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

        // Fetch Exchange Rate
        async function fetchExchangeRate() {
            try {
                const response = await fetch('https://api.example.com/exchange-rate');
                const data = await response.json();
                exchangeRate = data.rate;
                document.getElementById('exchangeRateDisplay').innerText = `Exchange Rate: 1 ETH = ${exchangeRate} Reach 9D-RC`;
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
            }
        }

        // Fetch Gas Fee
        async function fetchGasFee() {
            try {
                const response = await fetch('https://api.example.com/gas-fee');
                const data = await response.json();
                gasFee = data.fee;
                document.getElementById('gasFeeDisplay').innerText = `Estimated Gas Fees: ${gasFee} ETH`;
            } catch (error) {
                console.error('Failed to fetch gas fee:', error);
            }
        }

        // Initial fetch and interval updates
        setInterval(fetchExchangeRate, 60000); // Update every 60 seconds
        setInterval(fetchGasFee, 60000); // Update every 60 seconds
        fetchExchangeRate(); // Initial fetch
        fetchGasFee(); // Initial fetch

        // Update Reach 9D-RC amount based on ETH input
        document.getElementById('ethAmount').addEventListener('input', function() {
            const ethAmount = this.value;
            const reachAmount = ethAmount * exchangeRate;
            document.getElementById('reachAmountDisplay').innerText = `Reach 9D-RC: ${reachAmount}`;
        });

        // Handle form submission for buying tokens
        document.getElementById('sellTokensForm').addEventListener('submit', async function (e) {
            e.preventDefault();
            const walletAddress = userAccount;
            const ethAmount = document.getElementById('ethAmount').value;
            const reachAmount = ethAmount * exchangeRate;

            try {
                const response = await fetch('https://new-reach-backend.vercel.app/api/sell-tokens', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ walletAddress, amount: reachAmount })
                });

                const data = await response.json();
                document.getElementById('message').innerText = `Success! Transaction Hash: ${data.txHash}`;
            } catch (error) {
                document.getElementById('message').innerText = 'Failed to process the transaction. Please try again.';
            }
        });

        // Run check on page load
        checkWalletConnection();

        // Assign button event
        const connectWalletBtn = document.getElementById("connectWalletBtn");
        connectWalletBtn.onclick = connectWallet;

        // Define buyTokens function which was missing
        async function buyTokens() {
            if (!userAccount) {
                alert("Please connect your wallet first.");
                return;
            }

            let reachAmount = prompt("Enter the number of Reach Tokens you want to buy:");

            if (!reachAmount || isNaN(reachAmount) || reachAmount <= 0) {
                alert("Invalid amount.");
                return;
            }

            try {
                const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
                const data = await response.json();
                const ethPrice = data.ethereum.usd;  // Get ETH price in USD

                const reachPriceUSD = 27;  // Fixed price for 1 Reach Token
                const ethCost = (reachAmount * reachPriceUSD) / ethPrice;  // Convert to ETH

                const confirmPurchase = confirm(`You are buying ${reachAmount} REACH for ${ethCost.toFixed(6)} ETH. Confirm?`);
                if (!confirmPurchase) return;

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);

                const tx = await contract.buyTokens({
                    value: ethers.utils.parseEther(ethCost.toString())  // Send the correct ETH amount
                });

                alert("Transaction sent! Waiting for confirmation...");
                await tx.wait();
                alert(`Purchase successful! You received ${reachAmount} REACH.`);
            } catch (error) {
                console.error(error);
                alert("Transaction failed.");
            }
        }
    </script>
</body>
</html>

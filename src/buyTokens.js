async function buyTokens() {
  try {
    const tokenInput = parseFloat(document.getElementById("tokenAmount").value);
    if (!tokenInput || tokenInput <= 0) {
      alert("Enter a valid token amount.");
      return;
    }

    // 1. Get ETH/USD from Chainlink
    const priceFeed = new ethers.Contract(
      "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419", // ETH/USD mainnet feed
      [
        {
          "inputs": [],
          "name": "latestRoundData",
          "outputs": [
            { "name": "roundId", "type": "uint80" },
            { "name": "answer", "type": "int256" },
            { "name": "startedAt", "type": "uint256" },
            { "name": "updatedAt", "type": "uint256" },
            { "name": "answeredInRound", "type": "uint80" }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      provider
    );

    const roundData = await priceFeed.latestRoundData();
    const ethPrice = Number(roundData.answer) / 1e8;

    // 2. Calculate ETH required
    const usdPerToken = 27;
    const totalUSD = usdPerToken * tokenInput;
    const ethRequired = totalUSD / ethPrice;

    const ethValue = ethers.utils.parseEther(ethRequired.toFixed(6));
    const minTokens = ethers.utils.parseUnits(tokenInput.toString(), 18);

    // 3. Call smart contract buyTokens
    const seller = new ethers.Contract(
      "0x0557aFA4318989702376D50B45547F953b7F9B21",
      [
        {
          "inputs": [{ "internalType": "uint256", "name": "minTokens", "type": "uint256" }],
          "name": "buyTokens",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      signer
    );

    const tx = await seller.buyTokens(minTokens, {
      value: ethValue,
      gasLimit: 180000
    });

    document.getElementById("txStatus").textContent = "⏳ Waiting for confirmation...";
    await tx.wait();
    document.getElementById("txStatus").textContent = "✅ Purchase successful!";
  } catch (err) {
    console.error(err);
    document.getElementById("txStatus").textContent =
      `❌ Failed: ${err.reason || err.message || "Unknown error"}`;
  }
}

import React from "react";
import TokenSale from "./TokenSale";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "50px" }}>
      <header>
        <h1>Welcome to the Reach Token Sale</h1>
        <p>
          Purchase Reach Tokens securely using your ETH wallet. Powered by Web3.
        </p>
      </header>

      <main>
        <TokenSale />
      </main>

      <footer style={{ marginTop: "30px", fontSize: "0.9em", color: "#555" }}>
        <p>&copy; 2024 9th Dimension Robotics. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;



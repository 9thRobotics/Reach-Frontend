import React from "react";
import TokenSale from "./TokenSale";
import WalletConnect from "./WalletConnect";
import "./App.css"; // Optional: Add styles

import React from "react";
import TokenSale from "./TokenSale";

function App() {
  return (
    <div>
      <h1>Reach Token Frontend</h1>
      <TokenSale />
    </div>
  );
}

export default App;


function App() {
  return (
    <div>
      <h1>Welcome to the Reach Token Frontend</h1>
      <p>This is the front-end interface for the Reach Token project.</p>
    </div>
  );
}

export default App;


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Reach Token</h1>
        <p>The future of robotics and AI-powered solutions</p>
      </header>
      
      <main>
        {/* Wallet Connect Section */}
        <section id="wallet-connect">
          <h2>Connect Your Wallet</h2>
          <WalletConnect />
        </section>

        {/* Token Sale Section */}
        <section id="token-sale">
          <h2>Token Sale</h2>
          <TokenSale />
        </section>
      </main>

      <footer>
        <p>
          © 2024 9th Dimension Robotics | All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;


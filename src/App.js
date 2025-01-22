import React from 'react';
import Tokenomics from './components/Tokenomics';
import Hero from './components/Hero';
import BuySellTokens from './components/BuySellTokens';

function App() {
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <Tokenomics />
      <Hero />
      <div className="App">
        <h1>Welcome to Reach Token</h1>
        <BuySellTokens />
      </div>
      {/* Add other components here */}
    </div>
  );
}

export default App;

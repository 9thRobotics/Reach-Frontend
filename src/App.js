import React from 'react';
import Tokenomics from './components/Tokenomics'; // Adjust the path if necessary
import Hero from './components/Hero'; // Adjust the path if necessary

function App() {
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <Tokenomics />
      <Hero />
      {/* Add other components here */}
    </div>
  );
}

export default App;

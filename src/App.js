import React from 'react';
import Tokenomics from './components/Tokenomics'; // Adjust the path if necessary

const Hero = () => (
  <div className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center">
    <h1 className="text-5xl font-bold mb-4">Building the Future, One Robot at a Time</h1>
    <p className="text-lg mb-6">Join us on our journey to revolutionize robotics and AI.</p>
    <div>
      <button className="bg-blue-500 px-4 py-2 mr-2 rounded">Learn More</button>
      <button className="bg-green-500 px-4 py-2 rounded">Get Started</button>
    </div>
  </div>
);

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
import React from "react";
import BuySellTokens from "./components/BuySellTokens";

function App() {
    return (
        <div className="App">
            <h1>Welcome to Reach Token</h1>
            <BuySellTokens />
        </div>
    );
}

export default App;


export default App;

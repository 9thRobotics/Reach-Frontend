import React from 'react';

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

export default Hero;

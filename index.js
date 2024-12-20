import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

console.log("Node.js is running successfully!");

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const apiKey = process.env.API_KEY;
const databaseUrl = process.env.DATABASE_URL;
const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

// Your application logic here
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

const path = require('path');
const express = require('express');
const cors = require('cors'); // Added cors import

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Added mongoose import

const Transactions = require('./models/Transactions'); // Ensure you have this model file

mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); // Added mongoose connection

app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.post("/log-transaction", async (req, res) => {
    const { wallet, amount, txHash } = req.body;
    try {
        await Transactions.create({ wallet, amount, txHash });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

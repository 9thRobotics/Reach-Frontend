// Import dependencies and setup server
const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// API endpoint for 9th Dimension Robotics details
app.get('/api/details', (req, res) => {
    res.json({
        companyName: '9th Dimension Robotics',
        mission: 'To revolutionize manufacturing with robotics, AI, and renewable energy, creating a zero-emission global leader in consumer goods production.',
        goals: [
            'Automate manufacturing with cutting-edge robotics and AI.',
            'Develop proprietary robots and simulation software.',
            'Utilize blockchain to enhance transparency and efficiency.',
            'Integrate a cryptocurrency platform with Reach Tokens.',
            'Expand into space exploration and medical robotics.',
            'Achieve zero environmental impact.'
        ],
        tokenDetails: {
            name: 'Reach Token',
            initialSupply: '18 billion',
            price: '$27 per token',
            governance: {
                model: 'One wallet, one vote',
                lockedTokens: 'Two-thirds locked, one-third sellable immediately.'
            },
        },
        vision: [
            'Create robots that transform industries.',
            'Build a future where automation uplifts humanity.',
            'Integrate blockchain into every aspect of robotic operations.',
            'Leverage Freemasonry morals of integrity and progress.'
        ]
    });
});

// Default fallback for any undefined route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

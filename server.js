const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let messages = [];

// Homepage route
app.get("/", (req, res) => {
    res.send("Welcome to the Sinusonic Message Server!");
});

// Send a new message
app.post('/send-message', (req, res) => {
    const { nickname, message } = req.body;
    if (!nickname || !message) {
        return res.status(400).json({ error: 'Nickname and message are required' });
    }
    messages.push({ nickname, message });
    res.json({ success: true });
});

// Retrieve all messages
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
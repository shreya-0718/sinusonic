const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let messages = [];

// Homepage route (to prevent "Cannot GET /")
app.get("/", (req, res) => {
    res.send("Welcome to the Sinusonic Message Server!");
});

// Send message API
app.post('/send-message', (req, res) => {
    const { nickname, message } = req.body;
    if (!nickname || !message) {
        return res.status(400).json({ error: 'Nickname and message are required' });
    }
    messages.push({ nickname, message });
    res.json({ success: true });
});

// Get messages API
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Set the port dynamically for Codespaces
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const fetch = require('fetch'); // 📦 make sure to install: npm install node-fetch

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Your OpenRouter API key
const OPENROUTER_API_KEY = 'xyz'; // Replace this with your OpenRouter key

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000', // ✅ Required for OpenRouter
        'X-Title': 'My Chatbot App' 
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', 
        messages: [
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();

    if (response.ok) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error('OpenRouter API error:', data);
      res.status(500).json({ error: data.error?.message || 'Something went wrong with OpenRouter' });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Server error when connecting to OpenRouter' });
  }
});

app.listen(5000, () => {
  console.log('✅ Server is running on http://localhost:5000');
});

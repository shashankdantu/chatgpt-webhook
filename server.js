const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Use environment variable for security

app.use(bodyParser.json());

app.post('/chatgpt', async (req, res) => {
    const userMessage = req.body.queryResult.queryText; // Capture user input from Dialogflow

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [{ role: "user", content: userMessage }]
        }, {
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const reply = response.data.choices[0].message.content; // Get ChatGPT's response

        return res.json({ fulfillmentText: reply }); // Send it back to Dialogflow
    } catch (error) {
        console.error("Error communicating with OpenAI API:", error);
        return res.json({ fulfillmentText: "Sorry, I couldn't process your request." });
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

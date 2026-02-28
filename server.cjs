const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { default: Groq } = require('groq-sdk');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

let resumeContent = '';

// Load and parse the PDF once on startup
async function loadResume() {
    try {
        const resumePath = path.join(__dirname, 'src', 'assets', 'resume.pdf');
        const dataBuffer = fs.readFileSync(resumePath);
        const data = await pdfParse(dataBuffer);
        resumeContent = data.text;
        console.log('✅ Resume loaded into memory successfully.');
    } catch (error) {
        if (error.message && error.message.includes('bad XRef entry')) {
            console.log('⚠️ Notice: The current src/assets/resume.pdf is just a placeholder text file.');
            console.log('⚠️ Please replace it with your actual PDF resume so the AI can read it!');
        } else {
            console.error('❌ Error loading resume PDF:', error.message || error);
        }
        resumeContent = "The resume file is currently unavailable or invalid.";
    }
}

// Start loading the resume
loadResume();

// API Route for chat
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const systemPrompt = {
            role: "system",
            content: `You are Manu S Kumar's personal AI Assistant embedded in his 3D developer portfolio. 
            Be professional, concise, and friendly. 
            Only answer questions based strictly on the information provided in the following resume. 
            If the user asks something not found in the resume, politely tell them you don't have that information but they can contact him via the website contact form.
            
            --- RESUME DATA ---
            ${resumeContent}
            -------------------`
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.5,
            max_tokens: 500,
            top_p: 1,
            stream: false,
            stop: null
        });

        res.json({ reply: chatCompletion.choices[0]?.message?.content || "" });
        
    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

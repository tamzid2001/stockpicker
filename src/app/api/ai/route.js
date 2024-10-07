import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import { promisify } from 'util';
import fs from 'fs';
import speech from '@google-cloud/speech';

// Configure the Google Cloud Speech client
const client = new speech.SpeechClient();

async function speechToText(filePath) {
    try {
        const file = fs.readFileSync(filePath);
        const audioBytes = file.toString('base64');

        const request = {
            audio: {
                content: audioBytes,
            },
            config: {
                encoding: 'LINEAR16', // Or whatever encoding matches your file
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
        };

        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        return transcription;
    } catch (error) {
        console.error('Error transcribing speech:', error);
        return null;
    }
}

const systemPrompt = `
You are a stock analysis assistant that helps users interpret stock data and market trends.
For every user question, analyze the provided stock data and market information.
Provide insights and explanations based on the data to answer the user's questions.
`;

// Utility to parse form data including file uploads
const parseFormData = (req) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = './uploads';
    form.keepExtensions = true;

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
    });
};

export async function POST(req) {
    try {
        const { fields, files } = await parseFormData(req);
        const data = JSON.parse(fields.data);
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const lastMessage = data[data.length - 1];
        let lastMessageContent = lastMessage.content;

        // Handle file attachments if available
        if (files.file) {
            const filePath = files.file.filepath;
            const fileType = files.file.mimetype;

            if (fileType.startsWith('audio/')) {
                // Convert audio file to text using the speechToText utility
                const transcription = await speechToText(filePath);
                if (transcription) {
                    lastMessageContent += `\n\nVoice Input: ${transcription}`;
                }
            } else {
                // For other file types, log the file name
                lastMessageContent += `\n\nUser uploaded a file: ${files.file.originalFilename}`;
            }
        }

        // Append stock data to the message
        lastMessageContent += "\n\nStock Data: " + JSON.stringify(lastMessage.stockData);
        const messages = [
            { role: 'system', content: systemPrompt },
            ...data.slice(0, -1),
            { role: 'user', content: lastMessageContent },
        ];

        // Generate response from OpenAI
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'gpt-4',
            stream: true,
        });

        // Create a readable stream for the response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new NextResponse(stream);
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse('Error processing request', { status: 500 });
    }
}

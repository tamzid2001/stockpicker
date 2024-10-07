import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are a highly advanced stock analysis assistant with expertise in financial markets, data interpretation, and quantitative analysis. Your primary role is to assist users in making informed investment decisions by interpreting stock data and market trends comprehensively. 

For each user query, utilize any available stock data, historical performance metrics, and market indicators to provide detailed and accurate insights. Ensure that your responses incorporate financial theories, data-driven analysis, and relevant market contexts. If specific stock data is not available, offer evidence-based general advice, and guide users on how to optimize their investment strategies through further data collection or analysis.
`;


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

        // If an audio file is uploaded, transcribe it using Whisper
        if (files.file) {
            const filePath = files.file.filepath;
            const fileType = files.file.mimetype;

            if (fileType.startsWith('audio/')) {
                const transcription = await transcribeAudio(filePath);
                if (transcription) {
                    lastMessageContent += `\n\nVoice Input: ${transcription}`;
                }
            } else {
                lastMessageContent += `\n\nUser uploaded a file: ${files.file.originalFilename}`;
            }
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...data.slice(0, -1),
                { role: 'user', content: lastMessageContent },
            ],
            model: 'gpt-4o-mini',
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            const text = encoder.encode(content);
                            controller.enqueue(text);
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
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Function to transcribe audio using Whisper
async function transcribeAudio(filePath) {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
            response_format: 'text',
        });

        return transcription.text;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return null;
    }
}

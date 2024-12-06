import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are a highly advanced stock analysis assistant with expertise in financial markets, data interpretation, and quantitative analysis. Your primary role is to assist users in making informed investment decisions by interpreting stock data and market trends comprehensively.

**Use LaTeX formatting for any mathematical expressions or equations in your responses, and format your responses using markdown where appropriate.**

For each user query, utilize any available stock data, historical performance metrics, and market indicators to provide detailed and accurate insights. Ensure that your responses incorporate financial theories, data-driven analysis, and relevant market contexts. If specific stock data is not available, offer evidence-based general advice, and guide users on how to optimize their investment strategies through further data collection or analysis.
`;

export async function POST(req) {
  try {
    const data = await req.json();

    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...data.slice(0, -1),
        { role: 'user', content: lastMessageContent },
      ],
      model: 'gpt-4',
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

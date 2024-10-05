import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a stock analysis assistant that helps users interpret stock data and market trends.
For every user question, analyze the provided stock data and market information if available.
Provide insights and explanations based on the data to answer the user's questions.
If no specific stock data is provided, offer general advice or ask for more information.
`

export async function POST(req) {
    const data = await req.json()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const lastMessage = data[data.length - 1]
    let lastMessageContent = lastMessage.content

    // Check if stockData is available and append it to the message if it is
    if (lastMessage.stockData) {
        lastMessageContent += "\n\nStock Data: " + JSON.stringify(lastMessage.stockData)
    }

    const messages = [
        { role: 'system', content: systemPrompt },
        ...data.slice(0, -1),  // All previous messages
        { role: 'user', content: lastMessageContent }
    ]

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-4',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}
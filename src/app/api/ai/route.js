import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a stock analysis assistant that helps users interpret stock data and market trends.
For every user question, analyze the provided stock data and market information.
Provide insights and explanations based on the data to answer the user's questions.
`

export async function POST(req) {
    const data = await req.json()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const lastMessage = data[data.length - 1]
    const stockData = lastMessage.stockData
    const lastMessageContent = lastMessage.content + "\n\nStock Data: " + JSON.stringify(stockData)
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            ...lastDataWithoutLastMessage,
            { role: 'user', content: lastMessageContent },
        ],
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
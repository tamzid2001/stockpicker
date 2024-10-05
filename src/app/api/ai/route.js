import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { query, stockData } = req.body;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Given the following stock data: ${JSON.stringify(stockData)}\n\nUser query: ${query}\n\nResponse:`,
      max_tokens: 150,
    });

    res.status(200).json({ response: completion.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Error querying AI' });
  }
}
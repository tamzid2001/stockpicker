import { NextResponse } from 'next/server'

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const symbol = searchParams.get('symbol')

    const url = `https://${API_HOST}/stock/v3/get-chart?interval=1mo&region=US&symbol=${symbol}&range=5y&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`;
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching stock data' }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    const region = searchParams.get('region') || 'US';
    const lang = searchParams.get('lang') || 'en-US';

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    const url = `https://${API_HOST}/stock/get-earnings?symbol=${symbol}&region=${region}&lang=${lang}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
        },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data || !data.quoteSummary || !data.quoteSummary.result) {
            return NextResponse.json({ error: 'Invalid data received' }, { status: 500 });
        }

        const earningsData = data.quoteSummary.result[0].earnings.earningsChart.quarterly;

        // Calculate earnings surprises
        const earningsSurprises = earningsData.map((entry) => ({
            date: entry.date,
            actual: entry.actual.raw,
            estimate: entry.estimate.raw,
            surprise: entry.actual.raw - entry.estimate.raw,
        }));

        // Generate Monte Carlo Markov Chain (MCMC) analysis
        const recommendations = generateRecommendations(earningsSurprises);

        return NextResponse.json({ earningsSurprises, recommendations });
    } catch (error) {
        console.error('Error fetching earnings data:', error);
        return NextResponse.json({ error: 'Error fetching earnings data' }, { status: 500 });
    }
}

// Function to generate recommendations based on earnings surprises
function generateRecommendations(earningsSurprises) {
    const recommendations = [];
    for (let i = 1; i < earningsSurprises.length; i++) {
        const currentSurprise = earningsSurprises[i].surprise;
        const previousSurprise = earningsSurprises[i - 1].surprise;

        if (currentSurprise < previousSurprise) {
            recommendations.push({
                date: earningsSurprises[i].date,
                signal: 'Buy',
                reason: 'Decreasing negative earnings surprise.',
            });
        } else if (currentSurprise > previousSurprise) {
            recommendations.push({
                date: earningsSurprises[i].date,
                signal: 'Sell',
                reason: 'Increasing positive earnings surprise.',
            });
        } else {
            recommendations.push({
                date: earningsSurprises[i].date,
                signal: 'Hold',
                reason: 'No significant change in earnings surprise.',
            });
        }
    }

    return recommendations;
}

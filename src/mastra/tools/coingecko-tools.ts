import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
const coingeckoHeaders = {
    "accept": "application/json",
    "x-cg-demo-api-key": COINGECKO_API_KEY || "",
};

export const getCryptoPrice = createTool({
    id: "get-crypto-price",
    description: "Get the current market price and other data for a crypto asset using its CoinGecko ID (e.g., 'bitcoin', 'ethereum').",
    inputSchema: z.object({
        id: z.string().describe("The CoinGecko ID of the coin (e.g., 'bitcoin')."),
    }),
    outputSchema: z.any(),
    execute: async ({ context }) => {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${context.id}`;
        const response = await fetch(url, { headers: coingeckoHeaders });
        const data = await response.json();
        return data.length > 0 ? data[0] : { error: "Coin not found." };
    },
});

export const getHistoricalCryptoPrices = createTool({
    id: "get-historical-crypto-prices",
    description: "Get historical price data for a crypto asset, useful for chart analysis and calculating indicators.",
    inputSchema: z.object({
        id: z.string().describe("The CoinGecko ID of the coin (e.g., 'ethereum')."),
        days: z.number().default(30).describe("The number of days of historical data to retrieve."),
    }),
    outputSchema: z.any(),
    execute: async ({ context }) => {
        const url = `https://api.coingecko.com/api/v3/coins/${context.id}/market_chart?vs_currency=usd&days=${context.days}`;
        const response = await fetch(url, { headers: coingeckoHeaders });
        const data = await response.json();
        // Return a summary to avoid overloading the context window
        const prices = data.prices.map((p: number[]) => ({ timestamp: p[0], price: p[1] }));
        return {
            price_count: prices.length,
            start_price: prices[0]?.price,
            end_price: prices[prices.length - 1]?.price,
            prices_summary: prices.slice(-10) // last 10 data points
        };
    },
});
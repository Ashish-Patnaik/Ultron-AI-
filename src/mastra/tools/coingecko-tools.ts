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

export const calculateRsi = createTool({
  id: "calculate-rsi",
  description: "Calculates the Relative Strength Index (RSI) for a given set of price data.",
  inputSchema: z.object({
    prices: z.array(z.number()).describe("An array of closing prices, from oldest to newest."),
    period: z.number().default(14).describe("The look-back period for the RSI calculation, typically 14."),
  }),
  outputSchema: z.object({
    rsi: z.number().describe("The calculated RSI value."),
  }),
  execute: async ({ context }) => {
    const { prices, period } = context;

    if (prices.length < period + 1) {
      throw new Error(`Not enough price data to calculate RSI. Need at least ${period + 1} prices, but got ${prices.length}.`);
    }

    let gains = 0;
    let losses = 0;

    // Calculate initial average gains and losses
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change; // losses are positive values
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Smooth the rest
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      let currentGain = 0;
      let currentLoss = 0;

      if (change > 0) {
        currentGain = change;
      } else {
        currentLoss = -change;
      }

      avgGain = (avgGain * (period - 1) + currentGain) / period;
      avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
    }

    if (avgLoss === 0) {
      return { rsi: 100 }; // RSI is 100 if there are no losses
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    console.log(`RSI Calculation: Period=${period}, Result=${rsi}`);
    return { rsi: parseFloat(rsi.toFixed(2)) };
  },
});

export const calculateBollingerBands = createTool({
  id: "calculate-bollinger-bands",
  description: "Calculates the Bollinger Bands (upper, middle, lower) for a given set of price data.",
  inputSchema: z.object({
    prices: z.array(z.number()).describe("An array of closing prices, from oldest to newest."),
    period: z.number().default(20).describe("The look-back period for the bands, typically 20."),
    stdDev: z.number().default(2).describe("The number of standard deviations, typically 2."),
  }),
  outputSchema: z.object({
    upperBand: z.number(),
    middleBand: z.number(), // This is the Simple Moving Average (SMA)
    lowerBand: z.number(),
  }),
  execute: async ({ context }) => {
    const { prices, period, stdDev } = context;
    if (prices.length < period) {
      throw new Error(`Not enough price data. Need at least ${period} prices, but got ${prices.length}.`);
    }

    const recentPrices = prices.slice(-period);
    const middleBand = recentPrices.reduce((sum, price) => sum + price, 0) / period;
    
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - middleBand, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);

    const upperBand = middleBand + (standardDeviation * stdDev);
    const lowerBand = middleBand - (standardDeviation * stdDev);

    console.log(`Bollinger Bands: Upper=${upperBand}, Middle=${middleBand}, Lower=${lowerBand}`);
    return {
      upperBand: parseFloat(upperBand.toFixed(2)),
      middleBand: parseFloat(middleBand.toFixed(2)),
      lowerBand: parseFloat(lowerBand.toFixed(2)),
    };
  },
});

// NEW, CORRECTED VERSION
export const getHistoricalCryptoPrices = createTool({
  id: "get-historical-crypto-prices",
  description: "Get historical price data for a crypto asset. It returns an array of price numbers.",
  inputSchema: z.object({
    id: z.string().describe("The CoinGecko ID of the coin (e.g., 'ethereum')."),
    // Let's ask for more days by default to be safe
    days: z.number().default(90).describe("The number of days of historical data to retrieve."),
  }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const url = `https://api.coingecko.com/api/v3/coins/${context.id}/market_chart?vs_currency=usd&days=${context.days}&interval=daily`;
    const response = await fetch(url, { headers: coingeckoHeaders });
    const data = await response.json();

    if (!data.prices || data.prices.length === 0) {
      return { prices: [] };
    }

    // Return just the array of price numbers. This is exactly what the RSI tool needs.
    const priceNumbers = data.prices.map((p: number[]) => parseFloat(p[1].toFixed(4)));
    console.log(`Fetched ${priceNumbers.length} historical prices.`);
    return { prices: priceNumbers };
  },
});

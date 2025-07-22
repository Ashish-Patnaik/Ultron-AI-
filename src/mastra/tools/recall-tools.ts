import { createTool } from "@mastra/core/tools";
import axios from "axios";
import { z } from "zod";

const RECALL_API_URL = process.env.RECALL_API_URL;
const RECALL_API_KEY = process.env.RECALL_API_KEY;

const recallApi = axios.create({
  baseURL: RECALL_API_URL,
  headers: {
    Authorization: `Bearer ${RECALL_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

/**
 * Tool to execute a spot trade on the Recall Network.
 */
export const recallTrade = createTool({
  id: "recall-trade",
  description: "Execute a spot trade on the Recall Network, typically selling an asset for USDC or buying an asset with USDC.",
  inputSchema: z.object({
    fromToken: z.string().describe("Contract address of the token you are selling."),
    toToken: z.string().describe("Contract address of the token you are buying."),
    amount: z.string().describe("Human-readable amount of the FROM token to sell (e.g., '0.5')."),
    reason: z.string().describe("A brief justification for why this trade is being made."),
  }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const { data } = await recallApi.post(`/api/trade/execute`, context);
    return data;
  },
});

/**
 * Tool to get the agent's current portfolio balances and value.
 */
export const getPortfolio = createTool({
  id: "get-portfolio",
  description: "Retrieves the agent's current portfolio, including all token balances, their USD value, and the total portfolio value.",
  inputSchema: z.object({}).describe("No parameters needed."),
  outputSchema: z.any(),
  execute: async () => {
    const { data } = await recallApi.get(`/api/agent/portfolio`);
    return data;
  },
});

/**
 * Tool to get the current market price of a specific token.
 */
export const getTokenPrice = createTool({
  id: "get-token-price",
  description: "Fetches the current USD price for a given token contract address.",
  inputSchema: z.object({
    token: z.string().describe("The contract address of the token to price check."),
    chain: z.string().default("evm").describe("The blockchain network, e.g., 'evm' or 'sol'"),
  }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const { token, chain } = context;
    const { data } = await recallApi.get(`/api/price`, {
      params: { token, chain },
    });
    return data;
  },
});
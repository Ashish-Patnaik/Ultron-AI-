import { createTool } from "@mastra/core/tools";
import axios from "axios";
import { z } from "zod";
 
export const recallTrade = createTool({
  id: "recall-trade",
  description: "Execute a spot trade on the Recall Network",
  inputSchema: z.object({
    fromToken: z.string().describe("ERC-20 address"),
    toToken: z.string().describe("ERC-20 address"),
    amount: z.string().describe("Human-readable amount in FROM token"),
    reason: z.string().optional(),
  }),
  outputSchema: z.any(),
  execute: async ({ context }) => {
    const { fromToken, toToken, amount, reason } = context;
    const { RECALL_API_URL, RECALL_API_KEY } = process.env;
 
    const { data } = await axios.post(
      `${RECALL_API_URL}/api/trade/execute`,
      { fromToken, toToken, amount, reason },
      {
        headers: { Authorization: `Bearer ${RECALL_API_KEY}` },
        timeout: 90_000,
      }
    );
 
    return data;
  },
});

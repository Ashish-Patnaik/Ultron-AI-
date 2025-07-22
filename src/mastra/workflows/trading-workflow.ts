import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

// Schema for incoming TradingView alert data.
export const tradingViewAlertSchema = z.object({
  symbol: z.string().describe("The trading symbol (e.g., BTCUSDT)"),
  price: z.number().describe("Current price at alert trigger"),
  action: z.enum(["buy", "sell", "alert"]).describe("The action from the alert"),
  strategy: z.string().optional().describe("Trading strategy name"),
  message: z.string().optional().describe("Additional alert message"),
});

// A single, powerful step to analyze the alert.
const analyzeAlertStep = createStep({
  id: "analyze-trade-alert",
  description: "Takes a TradingView alert, invokes the Alpha Agent for analysis, and returns the result.",
  inputSchema: tradingViewAlertSchema,
  outputSchema: z.object({
    analysis: z.string(),
  }),
  //
  // THIS IS THE CORRECT, FINAL SIGNATURE
  //
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgent("alphaAgent");
    if (!agent) throw new Error("alphaAgent not found");

    // We must check if inputData exists, as it's optional on the base type
    if (!inputData) {
      throw new Error("Workflow step missing inputData.");
    }

    console.log(`[Workflow] Analyzing alert for ${inputData.symbol}...`);

    const prompt = `
      I have received the following TradingView alert. Please analyze it according to your instructions and provide a complete trading plan in the specified JSON format.

      Alert Data:
      - Symbol: ${inputData.symbol}
      - Price: ${inputData.price}
      - Action: ${inputData.action}
      - Strategy: ${inputData.strategy || 'N/A'}
      - Message: ${inputData.message || 'No message.'}
    `;

    const response = await agent.stream([{ role: "user", content: prompt }]);
    let analysisText = "";
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      analysisText += chunk;
    }
    process.stdout.write('\n');
    return { analysis: analysisText };
  },
});

export const tradingWorkflow = createWorkflow({
  id: "trading-workflow",
  inputSchema: tradingViewAlertSchema,
  outputSchema: z.object({
    analysis: z.string(),
  }),
}).then(analyzeAlertStep);

tradingWorkflow.commit();
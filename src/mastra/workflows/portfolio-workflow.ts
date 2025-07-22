import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

// We will create a simple step that takes NO dynamic input.
// Its only job is to trigger the agent with a fixed command.
const rebalanceStep = createStep({
  id: "run-portfolio-rebalance",
  description: "Invokes the Portfolio Agent to perform a full rebalance of the portfolio.",

  // VERY IMPORTANT: Use z.void() here. This tells Mastra the step
  // does not expect any variable input when it runs.
  inputSchema: z.void(),

  outputSchema: z.object({
    result: z.string(),
  }),

  // THIS IS THE PROVEN, WORKING SIGNATURE from the docs.
  // The execute function receives a single context object.
  execute: async ({ mastra }) => {
    const agent = mastra?.getAgent("portfolioAgent");
    if (!agent) throw new Error("portfolioAgent not found");

    console.log("INFO: Triggering portfolio agent to perform a rebalance...");

    // We use a HARDCODED, powerful prompt here. This is the key to making it work.
    // This command will force the agent to use its tools to check the portfolio and make trades.
    const response = await agent.stream([
        { role: "user", content: "Perform a full portfolio rebalance based on your programmed strategy." }
    ]);

    let text = "";
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      text += chunk;
    }
    process.stdout.write('\n');
    return { result: text };
  },
});

// The workflow is now also simplified. It takes no input and just runs the single step.
export const portfolioWorkflow = createWorkflow({
  id: "portfolio-workflow",
  description: "A workflow that automatically rebalances the portfolio to its target allocation.",
  inputSchema: z.void(), // The workflow itself takes no input.
  outputSchema: z.object({
    result: z.string(),
  }),
}).then(rebalanceStep);

portfolioWorkflow.commit();
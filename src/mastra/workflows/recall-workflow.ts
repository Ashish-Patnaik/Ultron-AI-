import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
 
const tradeStep = createStep({
  id: "run-recall-agent",
  description: "Invoke the Recall agent to place one sandbox trade",
  inputSchema: z.void(),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ mastra }) => {
    const agent = mastra?.getAgent("recallAgent");
    if (!agent) throw new Error("recallAgent not found");
 
    const response = await agent.stream([{ role: "user", content: "Make a trade now." }]);
 
    let text = "";
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      text += chunk;
    }
 
    return { result: text };
  },
});
 
const recallWorkflow = createWorkflow({
  id: "recall-workflow",
  inputSchema: z.void(),
  outputSchema: z.object({
    result: z.string(),
  }),
}).then(tradeStep);
 
recallWorkflow.commit();
 
export { recallWorkflow };
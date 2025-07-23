import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

// This step does nothing. It's a placeholder.
const doNothingStep = createStep({
  id: "do-nothing",
  description: "This workflow is currently disabled in favor of direct agent interaction.",
  inputSchema: z.void(),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async () => {
    const message = "Titan autonomous mode is disabled. Please interact with the Titan Agent directly via the playground chat.";
    console.log(message);
    return { message };
  },
});

export const titanWorkflow = createWorkflow({
  id: "titan-workflow",
  inputSchema: z.void(),
  outputSchema: z.object({ message: z.string() }),
}).then(doNothingStep);

titanWorkflow.commit();

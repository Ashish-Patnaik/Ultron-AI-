import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";

// Import WITH .js extensions
import { titanAgent } from "./agents/titan-agent.js";
import { titanWorkflow } from "./workflows/titan-workflow.js";

export const mastra = new Mastra({
  workflows: { titanWorkflow },
  agents: { titanAgent },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({ name: "TitanBot", level: "info" }),
});

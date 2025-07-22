import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";

// Import components WITH .js extensions 
import { alphaAgent } from "./agents/alpha-agent.js";
import { portfolioAgent } from "./agents/portfolio-agent.js";
import { tradingWorkflow } from "./workflows/trading-workflow.js";
import { portfolioWorkflow } from "./workflows/portfolio-workflow.js";
import { recallWorkflow } from "./workflows/recall-workflow.js";


// This is just the definition of the application.
export const mastra = new Mastra({
  workflows: {  tradingWorkflow, portfolioWorkflow, recallWorkflow  },
  agents: {  alphaAgent, portfolioAgent  },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({ name: "AlphaBot", level: "info" }),
});
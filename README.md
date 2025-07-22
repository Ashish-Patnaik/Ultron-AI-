# 🤖Ultron AI: An Autonomous Crypto Trading & Portfolio Management System

**Ultron AI** is a sophisticated, event-driven, and AI-powered trading bot built on the **Mastra** agent framework. It leverages Google's advanced Gemini models to operate as two distinct, highly intelligent agents: a tactical **Alpha Agent** for analyzing and executing trades based on technical signals, and a strategic **Portfolio Agent** for maintaining long-term portfolio health.

This system is designed to connect directly to **TradingView** for signal generation and execute trades on the **Recall Network** competition platform, creating a complete, end-to-end automated trading solution.

<br>

## Demo


https://github.com/user-attachments/assets/0ee0e890-3472-40ff-94af-c1a21390dc2c



## 🚀 Key Features

- **Dual-Agent Intelligence:** Features two specialized agents, each with a unique purpose, providing both short-term tactical trading and long-term strategic management.
- **Google Gemini-Powered Reasoning:** Utilizes Google's `gemini-1.5-pro` model for deep analysis, multi-tool use, and structured decision-making.
- **Event-Driven Trading:** Listens for real-time trading alerts from TradingView via webhooks to enable immediate, automated analysis and action.
- **Data-Enriched Decisions:** The Alpha Agent automatically enriches incoming signals with live and historical market data from CoinGecko before making a decision.
- **Comprehensive Toolset:** Equipped with tools to fetch portfolio balances, get token prices, research market data, and execute trades on the Recall Network.
- **Interactive Development:** Includes the Mastra Playground for live-chatting with agents, debugging their thought processes, and issuing manual commands.

<br>
<hr>


## 🧠 The Agents: A Tale of Two Brains

Ultron AI's power comes from its dual-agent architecture, allowing for a separation of concerns between opportunistic trading and disciplined portfolio management.

### 🤖 **The Alpha Agent**: *The Tactical Analyst*
The Alpha Agent is your front-line trader, designed for precision and speed.

*   **Its Mission:** To receive a simple trading signal (e.g., "BTCUSDT is oversold"), conduct a full due-diligence analysis, and propose a complete trading plan.
*   **How it's Smart:**
    1.  **Never Acts Blindly:** It is explicitly instructed to **never** trust an alert alone.
    2.  **Enriches Data:** Upon receiving a signal, it automatically uses its tools to fetch the current price, historical data, and current portfolio exposure.
    3.  **Formulates a Plan:** It synthesizes all this information to generate a structured JSON output containing:
        *   A concise `analysis_summary`.
        *   A clear `decision` (`BUY`, `SELL`, or `HOLD`).
        *   A `confidence_score` from 0-100.
        *   A full `trading_plan` with entry, target, and stop-loss prices.
        *   A detailed `risk_assessment`.
    4.  **Awaits Confirmation:** It presents its plan and waits for a human "go-ahead" before executing the trade, providing a crucial safety layer.

### 🏛️ **The Portfolio Agent**: *The Strategic Manager*
The Portfolio Agent is your long-term wealth manager, focused on stability and strategy.

*   **Its Mission:** To maintain a pre-defined target portfolio allocation (e.g., 50% WETH, 25% WBTC, 25% USDC).
*   **How it's Smart:**
    1.  **Understands Strategy:** It knows the target weights and the concept of "portfolio drift."
    2.  **Self-Correcting:** When instructed to "rebalance," it uses the `getPortfolio` tool to assess the current state.
    3.  **Calculates & Executes:** It calculates the exact trades needed to return to the target allocation and executes them logically (sells first to free up capital, then buys).
    4.  **Hands-Free Operation:** This agent is designed to be triggered by automated workflows (e.g., a daily cron job) for disciplined, hands-free rebalancing.

<br>
<hr>

## 📋 Prerequisites

| Requirement | Purpose |
| :--- | :--- |
| **Node.js** v20+ | JavaScript runtime for the bot. |
| **npm** (comes with Node) | Package manager for installing dependencies. |
| **Google AI API Key** | Powers the Gemini model for agent reasoning. |
| **Recall API Key** | Grants access to the trading simulator endpoints. |
| **CoinGecko API Key** | For fetching live and historical market data. |
| **TradingView Account** | To generate and send webhook alerts. |
| **ngrok** (Optional) | To expose your local server to the internet for live webhook testing. |

<br>
<hr>

## 🛠️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url>
    cd ultron-ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```
    Now, edit the `.env` file with your secret keys:
    ```properties
    # Your Google AI API Key from Google AI Studio
    GOOGLE_API_KEY=your-google-api-key

    # Your Recall Network API Key and Sandbox URL
    RECALL_API_KEY=your-recall-api-key
    RECALL_API_URL=https://api.sandbox.competitions.recall.network

    # Your CoinGecko API Key (free tier is fine)
    COINGECKO_API_KEY=your-coingecko-api-key
    ```

<br>
<hr>

## 🚀 Usage & Running the Bot

Ultron AI can be run in two modes: **Development Mode** for interactive testing and **Production Mode** for deployment.

### Development Mode (Recommended for most users)

This is the best way to interact with your agents, debug, and test webhooks locally. It starts a single server that hosts both the **Mastra Playground UI** and the **Webhook Listener**.

1.  **Start the Dev Server**
    This is the only command you need for development:
    ```bash
    npm run dev
    ```
2.  **Access the Playground**
    *   Open your browser and navigate to **`http://localhost:4111`**.
    *   Select an agent and chat with it directly.
3.  **Test Webhooks**
    *   Your webhook endpoint is running at `http://localhost:4111/webhook/tradingview`.
    *   See the **"🔌 Setting Up Webhooks"** section below for how to test it.

### Production Mode

This mode is for deploying your bot to a live server. It builds an optimized version of the app and runs only the API, without the Playground UI.

1.  **Build the Application**
    This command creates an optimized production build in the `.mastra/output` directory.
    ```bash
    npm run build
    ```
2.  **Start the Production Server**
    This command runs the built application.
    ```bash
    npm run start
    ```
    Your API and webhook listener will now be running, but the Playground UI will not be available.

<br>
<hr>

## 🔌 Setting Up Webhooks

To connect TradingView to your bot, you need a publicly accessible URL.

### 1. Exposing Your Local Server with `ngrok`

For testing, `ngrok` is a fantastic tool that creates a secure, public URL that tunnels to your local server.

1.  **Install `ngrok`** (follow instructions on their website).
2.  **Start your Ultron AI dev server:** `npm run dev`. Note the port (e.g., 4111).
3.  **In a new terminal, start `ngrok`:**
    ```bash
    ngrok http 4111
    ```
4.  **Get Your URL:** `ngrok` will give you a public "Forwarding" URL that looks like `https://<random-id>.ngrok-free.app`. **This is your public webhook URL.**

### 2. Configuring the TradingView Alert

Now, set up your alert in TradingView to send data to your bot.

1.  On your TradingView chart, create a new alert.
2.  In the alert settings, go to the "Notifications" tab.
3.  **Enable the "Webhook URL" checkbox.**
4.  Paste your `ngrok` URL into the box, making sure to add the correct path:
    `https://<random-id>.ngrok-free.app/webhook/tradingview`
5.  **In the "Message" box, you must provide a valid JSON payload.** Use TradingView's `{{placeholders}}` to send dynamic data.

    **Example for a "Buy" alert:**
    ```json
    {
      "symbol": "{{ticker}}",
      "price": {{close}},
      "action": "buy",
      "strategy": "RSI Oversold on 4H",
      "message": "RSI for {{ticker}} is now {{plot_0}}"
    }
    ```
6.  Click "Create". When the alert triggers, it will send the data to your running bot, and you will see the Alpha Agent begin its analysis in your `npm run dev` terminal.

### 3. Testing Webhooks without `ngrok`

If you just want to quickly test that the server is working without setting up `ngrok`, you can send a request directly from your command line.

**In a new terminal, run this PowerShell command:**
```powershell
Invoke-WebRequest -Uri http://localhost:4111/webhook/tradingview -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"symbol": "ETHUSDT", "price": 3500.00, "action": "buy", "strategy": "MACD Crossover"}'
```
You will see the logs appear instantly in your `npm run dev` terminal..

### Interacting with Ultron AI

1.  **Mastra Playground (The Command Center)**
    *   Open your browser and navigate to **`http://localhost:4111`**.
    *   Here you can select either the `alphaAgent` or `portfolioAgent` from the dropdown.
    *   **Chat with your agents directly!**
        *   **Ask the Portfolio Agent:** `"What are my current balances?"` or `"Please rebalance my portfolio now."`
        *   **Ask the Alpha Agent:** `"What is the current market sentiment for Ethereum?"` or give it a manual trade command.
    *   You can watch the full thought process, tool usage, and final responses of your agents in real-time.

2.  **TradingView Webhook (The Automated Trigger)**
    *   **Endpoint URL:** Your webhook endpoint is now running at **`http://<your-public-ip-or-ngrok-url>:4111/webhook/tradingview`**. For local development, this is `http://localhost:4111/webhook/tradingview`.
    *   **Testing Locally:** To test the webhook without setting up TradingView, open a **new terminal** and use the following PowerShell command:
        ```powershell
        Invoke-WebRequest -Uri http://localhost:4111/webhook/tradingview -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"symbol": "BTCUSDT", "price": 68500.00, "action": "buy", "strategy": "RSI Oversold on 4H"}'
        ```
    *   **Check the Logs:** Go back to your `npm run dev` terminal. You will see the log `[Webhook] Received TradingView alert...` followed by the Alpha Agent's complete, detailed analysis.

<br>
<hr>

## 🏗️ Architecture & Workflow

The system follows a clean, event-driven architecture:

```
TradingView Alert → Webhook Endpoint (on Mastra Server) → Trading Workflow → Alpha Agent → Data Tools (CoinGecko, Recall) → Analysis & Execution
```

This ensures that signals are processed systematically, enriched with data, and acted upon by a specialized AI, providing a robust foundation for any automated trading strategy.

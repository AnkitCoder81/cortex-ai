# Cortex AI

An advanced, microservices-based AI platform featuring specialized agents for chat, coding, image analysis, PDF RAG, PowerPoint generation, and web search. 

## 🚀 Features

* **Agentic AI Workflow:** Utilizes a graph-based routing system (`graph.js`, `router.js`) to direct user queries to specialized AI agents (Vision, Coding, PDF RAG, Search).
* **Microservices Architecture:** Independently scalable backend services including API Gateway, Auth, Agent processing, Chat history, and Billing.
* **Authentication & Security:** Integrated with Firebase Auth and secured via an API gateway with header proxying.
* **Cloud Storage & Caching:** AWS S3 integration for document handling and Redis for high-performance caching.
* **Monetization:** Built-in billing service utilizing Razorpay for subscription and credit management.
* **Dockerized:** Fully containerized backend using `docker-compose` for unified local development.

## 🛠️ Tech Stack

**Frontend:** React, Vite, Redux, Tailwind CSS (assumed), Axios, Firebase SDK
**Backend:** Node.js, Express.js, Microservices
**AI & Search:** Embeddings, Vector Database, Tavily Search API, LLM integration
**Databases & Caching:** MongoDB, Redis
**Infrastructure:** Docker, AWS (EC2/ECS, S3), Razorpay

## 📂 Project Structure

* `/frontend` - Vite-based React application with Redux state management.
* `/backend/gateway` - Entry point and request router.
* `/backend/services/agent` - Core AI logic, RAG pipelines, and tool execution.
* `/backend/services/auth` - Firebase user authentication and session management.
* `/backend/services/billing` - Payment processing and usage limits.
* `/backend/services/chat` - Conversation and message history management.
* `/backend/shared` - Shared resources like Redis configurations.

## ⚙️ Local Setup

### Prerequisites
* Node.js v18+
* Docker & Docker Compose
* AWS Account (for S3)
* Firebase Service Account Key
* API Keys for LLMs and Search (e.g., Tavily, OpenAI/Groq)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YourUsername/cortex-ai.git
cd cortex-ai
\`\`\`

### 2. Configure Environment Variables
You must create `.env` files in the respective service directories since they are not tracked in Git.

**Create `/backend/services/agent/.env`:**
\`\`\`env
PORT=...
MONGO_URI=...
LLM_API_KEY=...
TAVILY_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_S3_BUCKET_NAME=...
REDIS_URL=...
\`\`\`

**Create `/backend/services/auth/.env`:**
\`\`\`env
PORT=...
MONGO_URI=...
# Note: Add serviceAccountKey.json to the /auth/config directory
\`\`\`

**Create `/backend/services/billing/.env`:**
\`\`\`env
PORT=...
MONGO_URI=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
\`\`\`

### 3. Run with Docker Compose
To start the entire backend microservices architecture:
\`\`\`bash
cd backend
docker-compose up --build
\`\`\`

### 4. Start the Frontend
In a separate terminal:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## ☁️ Deployment (AWS)

*Documentation for AWS deployment (e.g., ECS, EKS, or App Runner) is currently in progress.*

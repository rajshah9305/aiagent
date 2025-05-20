# AI Agents Web Application

A production-ready, open-source web application featuring a suite of AI agents inspired by iconic Hollywood/TV characters. This platform provides a modern and professional user experience for interacting with AI assistants.

## Features

### Core Functionality

- **AI Agent Integration**: Utilizes LangChain, CrewAI, and CopilotKit to implement AI agent functionalities. Integrates with SambaNova AI Cloud Services for model hosting and inference.
- **Frontend Framework**: Built with Next.js, React, Tailwind CSS, and Framer Motion for a sleek and responsive user interface.
- **Agent Management**: Create, configure, and manage individual agents with configurable parameters including:
  - AI model selection (from SambaNova AI Cloud Services)
  - Temperature
  - Available tools
  - Knowledge sources
  - Memory management
  - Web access control
- **Conversation Management**: Natural and fluid conversation interface with robust memory and context handling.
- **Knowledge & Search**: Integrated knowledge base and web search capabilities for agents to access information.
- **Follow-up Suggestions**: Generates relevant follow-up questions to guide user interaction.
- **NSFW Handling**: Implements appropriate mechanisms for handling or restricting NSFW content.
- **User Interface**: Visually appealing and responsive dashboard featuring animated agent cards.
- **Multimodal Capabilities**: Support for both text and image inputs, allowing for richer interactions.

### Template AI Agents

The application comes with pre-configured agents inspired by iconic characters:

1. **Better Call Saul (Legal Strategist)**
   - TV Reference: Saul Goodman (Breaking Bad)
   - Function: Provides legal advice, drafts contracts and disclaimers, and assists with regulatory compliance.
   - Tagline: "Subpoenas faster than you can blink."

2. **SheldonGPT (Research Assistant)**
   - TV Reference: Sheldon Cooper (The Big Bang Theory)
   - Function: Conducts academic, technical, and scientific research, providing citations where applicable.
   - Tagline: "Smarter than you. And will remind you."

3. **Wolf of Wall Street (Sales Assistant)**
   - Movie Reference: Jordan Belfort (Wolf of Wall Street)
   - Function: Generates sales email scripts, persuasive pitches, and growth hacking strategies.
   - Tagline: "Sell anything. Charm everyone."

4. **Jarvis (Admin / Personal Assistant)**
   - Movie Reference: Iron Man's AI
   - Function: Manages tasks, sets reminders, handles calendar entries, and provides user notifications.
   - Tagline: "Always at your service — efficient, sharp, and dependable."

5. **Q (Prompt Optimizer & Data Analyst)**
   - Movie Reference: Q (James Bond)
   - Function: Creates advanced prompts, analyzes user data, and assists in workflow automation design.
   - Tagline: "Gadget your AI with perfect prompts."

### Advanced Features

- **Agent-to-agent collaboration workflows**
- **Administrative dashboard for system management**
- **User feedback mechanisms for continuous improvement**
- **API exposure for potential external integrations**

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- SambaNova API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rajshah9305/aiagent.git
   cd aiagent
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your SambaNova API key:

   ```env
   NEXT_PUBLIC_SAMBANOVA_API_KEY=your_api_key_here
   SAMBANOVA_API_KEY=your_api_key_here
   SAMBANOVA_API_URL=https://api.sambanova.ai/v1
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Using the Deployment Script

You can use the included deployment script:

```bash
./deploy.sh
```

### Deploying to Vercel (Recommended)

This application is ready for deployment on Vercel:

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Set the environment variables in the Vercel dashboard.
4. Deploy!

### Other Deployment Options

- **Netlify**: Connect your GitHub repository and set up environment variables.
- **AWS Amplify**: Use the Amplify CLI to deploy the application.
- **Docker**: Use the provided Dockerfile to containerize the application.

## Project Structure

```text
aiagent/
├── public/
│   └── images/
│       └── agents/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   └── mock-chat/
│   │   └── page.tsx
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── AgentCard.tsx
│   │   ├── AgentCollaboration.tsx
│   │   ├── AgentSettings.tsx
│   │   ├── ChatInterface.tsx
│   │   └── KnowledgeBase.tsx
│   ├── lib/
│   │   ├── agents.ts
│   │   ├── ai-integration.ts
│   │   ├── ai-service.ts
│   │   ├── sambanova.ts
│   │   └── store.ts
│   └── types/
│       └── index.ts
├── scripts/
│   └── generate-placeholders.js
├── package.json
└── README.md
```

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **AI Integration**: LangChain, CrewAI, CopilotKit
- **Cloud Services**: SambaNova AI Cloud Services

## License

This project is open source and available under the [MIT License](LICENSE).

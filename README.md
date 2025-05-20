# AI Agents Web Application

A production-ready, open-source web application featuring a suite of AI agents inspired by iconic Hollywood/TV characters. Built with Next.js, React, Tailwind CSS, and Framer Motion, with SambaNova AI Cloud Services integration.

## Features

- **AI Agent Integration**: Utilizes LangChain, CrewAI, and CopilotKit with SambaNova AI Cloud Services
- **Conversation Management**: Natural and fluid conversation interface with memory and context handling
- **Agent Management**: Create, configure, and manage individual agents with customizable parameters
- **Knowledge & Search**: Integrated knowledge base and web search capabilities
- **Follow-up Suggestions**: Generates relevant follow-up questions to guide user interaction
- **NSFW Handling**: Appropriate mechanisms for handling or restricting NSFW content
- **Agent Collaboration**: Agent-to-agent collaboration workflows
- **Administrative Dashboard**: System management and monitoring
- **User Feedback**: Mechanisms for continuous improvement
- **API Exposure**: External integration capabilities

## Pre-configured Agents

- **Better Call Saul (Legal Strategist)**: Provides legal advice, drafts contracts and disclaimers
- **SheldonGPT (Research Assistant)**: Conducts academic, technical, and scientific research
- **Wolf of Wall Street (Sales Assistant)**: Generates sales email scripts and persuasive pitches
- **Jarvis (Admin / Personal Assistant)**: Manages tasks, reminders, and calendar entries
- **Q (Prompt Optimizer & Data Analyst)**: Creates advanced prompts and analyzes user data

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- SambaNova API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-agents-app.git
cd ai-agents-app
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
# or
yarn install --legacy-peer-deps
```

3. Create a `.env.local` file in the root directory and add your SambaNova API key:
```
NEXT_PUBLIC_SAMBANOVA_API_KEY=your_api_key_here
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

```
ai-agents-app/
├── public/
│   └── images/
│       └── agents/
├── src/
│   ├── app/
│   │   ├── api/
│   │   └── page.tsx
│   ├── components/
│   │   ├── AdminDashboard.tsx
│   │   ├── AgentCard.tsx
│   │   ├── AgentCollaboration.tsx
│   │   ├── AgentSettings.tsx
│   │   ├── ApiDocs.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── KnowledgeBase.tsx
│   │   ├── NSFWHandling.tsx
│   │   └── UserFeedback.tsx
│   ├── hooks/
│   ├── lib/
│   │   ├── agents.ts
│   │   ├── ai-integration.ts
│   │   ├── ai-service.ts
│   │   ├── sambanova.ts
│   │   └── store.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
└── package.json
```

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **AI Integration**: LangChain, CrewAI, CopilotKit
- **Cloud Services**: SambaNova AI Cloud Services

## License

This project is open source and available under the [MIT License](LICENSE).

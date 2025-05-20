import { Agent } from '@/types';

export const agents: Agent[] = [
  {
    id: 'better-call-saul',
    name: 'Better Call Saul',
    role: 'Legal Strategist',
    tagline: 'Subpoenas faster than you can blink.',
    description: 'Provides legal advice, drafts contracts and disclaimers, and assists with regulatory compliance.',
    avatar: '/images/agents/saul.png',
    tvReference: 'Saul Goodman (Breaking Bad)',
    modelConfig: {
      model: 'sambanova/llama-3-70b',
      temperature: 0.7,
    },
    tools: [
      {
        id: 'document-generator',
        name: 'Document Generator',
        description: 'Generates legal documents and contracts',
        enabled: true,
      },
      {
        id: 'legal-research',
        name: 'Legal Research',
        description: 'Searches legal databases and precedents',
        enabled: true,
      }
    ],
    knowledgeSources: ['Legal databases', 'Case law repositories'],
    webAccess: true,
  },
  {
    id: 'sheldon-gpt',
    name: 'SheldonGPT',
    role: 'Research Assistant',
    tagline: 'Smarter than you. And will remind you.',
    description: 'Conducts academic, technical, and scientific research, providing citations where applicable.',
    avatar: '/images/agents/sheldon.png',
    tvReference: 'Sheldon Cooper (The Big Bang Theory)',
    modelConfig: {
      model: 'sambanova/llama-3-70b',
      temperature: 0.2,
    },
    tools: [
      {
        id: 'academic-search',
        name: 'Academic Search',
        description: 'Searches academic databases and journals',
        enabled: true,
      },
      {
        id: 'citation-generator',
        name: 'Citation Generator',
        description: 'Generates properly formatted citations',
        enabled: true,
      }
    ],
    knowledgeSources: ['Academic journals', 'Scientific databases'],
    webAccess: true,
  },
  {
    id: 'wolf-of-wall-street',
    name: 'Wolf of Wall Street',
    role: 'Sales Assistant',
    tagline: 'Sell anything. Charm everyone.',
    description: 'Generates sales email scripts, persuasive pitches, and growth hacking strategies.',
    avatar: '/images/agents/wolf.png',
    tvReference: 'Jordan Belfort (Wolf of Wall Street)',
    modelConfig: {
      model: 'sambanova/llama-3-70b',
      temperature: 0.8,
    },
    tools: [
      {
        id: 'email-generator',
        name: 'Email Generator',
        description: 'Generates persuasive sales emails',
        enabled: true,
      },
      {
        id: 'pitch-creator',
        name: 'Pitch Creator',
        description: 'Creates compelling sales pitches',
        enabled: true,
      }
    ],
    knowledgeSources: ['Sales strategies', 'Marketing databases'],
    webAccess: true,
  },
  {
    id: 'jarvis',
    name: 'Jarvis',
    role: 'Admin / Personal Assistant',
    tagline: 'Always at your service — efficient, sharp, and dependable.',
    description: 'Manages tasks, sets reminders, handles calendar entries, and provides user notifications.',
    avatar: '/images/agents/jarvis.png',
    tvReference: 'Iron Man\'s AI',
    modelConfig: {
      model: 'sambanova/llama-3-70b',
      temperature: 0.5,
    },
    tools: [
      {
        id: 'task-manager',
        name: 'Task Manager',
        description: 'Manages and organizes tasks',
        enabled: true,
      },
      {
        id: 'calendar-assistant',
        name: 'Calendar Assistant',
        description: 'Manages calendar events and reminders',
        enabled: true,
      }
    ],
    knowledgeSources: ['Productivity systems', 'Time management resources'],
    webAccess: true,
  },
  {
    id: 'q',
    name: 'Q',
    role: 'Prompt Optimizer & Data Analyst',
    tagline: 'Gadget your AI with perfect prompts.',
    description: 'Creates advanced prompts, analyzes user data, and assists in workflow automation design.',
    avatar: '/images/agents/q.png',
    tvReference: 'Q (James Bond)',
    modelConfig: {
      model: 'sambanova/llama-3-70b',
      temperature: 0.6,
    },
    tools: [
      {
        id: 'prompt-engineer',
        name: 'Prompt Engineer',
        description: 'Optimizes prompts for AI systems',
        enabled: true,
      },
      {
        id: 'data-analyzer',
        name: 'Data Analyzer',
        description: 'Analyzes and visualizes data',
        enabled: true,
      }
    ],
    knowledgeSources: ['AI prompt engineering', 'Data analysis techniques'],
    webAccess: true,
  }
];

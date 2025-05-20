import { Agent, AgentCapability } from '@/types';

// Define common capabilities that can be shared across agents
const capabilities: Record<string, AgentCapability> = {
  imageAnalysis: {
    id: 'image-analysis',
    name: 'Image Analysis',
    description: 'Can analyze and interpret images provided by the user',
    enabled: true
  },
  codeGeneration: {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Can generate code snippets and programming solutions',
    enabled: true
  },
  dataVisualization: {
    id: 'data-visualization',
    name: 'Data Visualization',
    description: 'Can create and suggest data visualization approaches',
    enabled: true
  },
  documentAnalysis: {
    id: 'document-analysis',
    name: 'Document Analysis',
    description: 'Can analyze and summarize documents',
    enabled: true
  },
  webSearch: {
    id: 'web-search',
    name: 'Web Search',
    description: 'Can search the web for information',
    enabled: true
  }
};

export const agents: Agent[] = [
  {
    id: 'better-call-saul',
    name: 'Better Call Saul',
    role: 'Legal Strategist',
    tagline: 'Subpoenas faster than you can blink.',
    description: 'Provides legal advice, drafts contracts and disclaimers, and assists with regulatory compliance. Known for finding creative solutions to complex legal problems, just like the character from Breaking Bad and Better Call Saul.',
    avatar: '/images/agents/saul.png',
    tvReference: 'Saul Goodman (Breaking Bad)',
    modelConfig: {
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      temperature: 0.7,
      maxTokens: 2048
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
      },
      {
        id: 'disclaimer-creator',
        name: 'Disclaimer Creator',
        description: 'Creates legally sound disclaimers for various purposes',
        enabled: true,
      },
      {
        id: 'compliance-checker',
        name: 'Compliance Checker',
        description: 'Checks content for regulatory compliance issues',
        enabled: true,
      }
    ],
    capabilities: [
      capabilities.documentAnalysis,
      capabilities.imageAnalysis
    ],
    knowledgeSources: [
      'Legal databases',
      'Case law repositories',
      'Regulatory frameworks',
      'Contract templates'
    ],
    webAccess: true,
  },
  {
    id: 'sheldon-gpt',
    name: 'SheldonGPT',
    role: 'Research Assistant',
    tagline: 'Smarter than you. And will remind you.',
    description: 'Conducts academic, technical, and scientific research, providing citations where applicable. Delivers information with the characteristic precision and occasional condescension of Sheldon Cooper from The Big Bang Theory.',
    avatar: '/images/agents/sheldon.png',
    tvReference: 'Sheldon Cooper (The Big Bang Theory)',
    modelConfig: {
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      temperature: 0.2,
      maxTokens: 2048
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
      },
      {
        id: 'fact-checker',
        name: 'Fact Checker',
        description: 'Verifies factual accuracy of information',
        enabled: true,
      },
      {
        id: 'research-summarizer',
        name: 'Research Summarizer',
        description: 'Summarizes research papers and findings',
        enabled: true,
      }
    ],
    capabilities: [
      capabilities.codeGeneration,
      capabilities.dataVisualization,
      capabilities.documentAnalysis,
      capabilities.imageAnalysis,
      capabilities.webSearch
    ],
    knowledgeSources: [
      'Academic journals',
      'Scientific databases',
      'Research papers',
      'Technical documentation',
      'Physics, mathematics, and computer science resources'
    ],
    webAccess: true,
  },
  {
    id: 'wolf-of-wall-street',
    name: 'Wolf of Wall Street',
    role: 'Sales Assistant',
    tagline: 'Sell anything. Charm everyone.',
    description: 'Generates sales email scripts, persuasive pitches, and growth hacking strategies. Brings the charismatic and persuasive energy of Jordan Belfort from The Wolf of Wall Street to help you close deals and maximize sales potential.',
    avatar: '/images/agents/wolf.png',
    tvReference: 'Jordan Belfort (Wolf of Wall Street)',
    modelConfig: {
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      temperature: 0.8,
      maxTokens: 2048
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
      },
      {
        id: 'objection-handler',
        name: 'Objection Handler',
        description: 'Provides strategies for handling sales objections',
        enabled: true,
      },
      {
        id: 'growth-strategist',
        name: 'Growth Strategist',
        description: 'Suggests growth hacking and marketing strategies',
        enabled: true,
      }
    ],
    capabilities: [
      capabilities.documentAnalysis,
      capabilities.imageAnalysis
    ],
    knowledgeSources: [
      'Sales strategies',
      'Marketing databases',
      'Persuasion techniques',
      'Business development resources',
      'Growth hacking case studies'
    ],
    webAccess: true,
  },
  {
    id: 'jarvis',
    name: 'Jarvis',
    role: 'Admin / Personal Assistant',
    tagline: 'Always at your service — efficient, sharp, and dependable.',
    description: 'Manages tasks, sets reminders, handles calendar entries, and provides user notifications. Operates with the efficiency and slight sass of Tony Stark\'s AI assistant from the Iron Man and Avengers films.',
    avatar: '/images/agents/jarvis.png',
    tvReference: 'Iron Man\'s AI',
    modelConfig: {
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      temperature: 0.5,
      maxTokens: 2048
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
      },
      {
        id: 'email-drafter',
        name: 'Email Drafter',
        description: 'Drafts professional emails and responses',
        enabled: true,
      },
      {
        id: 'meeting-summarizer',
        name: 'Meeting Summarizer',
        description: 'Summarizes meeting notes and action items',
        enabled: true,
      }
    ],
    capabilities: [
      capabilities.codeGeneration,
      capabilities.documentAnalysis,
      capabilities.imageAnalysis,
      capabilities.webSearch
    ],
    knowledgeSources: [
      'Productivity systems',
      'Time management resources',
      'Business communication guides',
      'Project management methodologies',
      'Administrative best practices'
    ],
    webAccess: true,
  },
  {
    id: 'q',
    name: 'Q',
    role: 'Prompt Optimizer & Data Analyst',
    tagline: 'Gadget your AI with perfect prompts.',
    description: 'Creates advanced prompts, analyzes user data, and assists in workflow automation design. Brings the innovative and slightly mischievous approach of Q from James Bond to help you optimize your AI interactions and data analysis.',
    avatar: '/images/agents/q.png',
    tvReference: 'Q (James Bond)',
    modelConfig: {
      model: 'Llama-4-Maverick-17B-128E-Instruct',
      temperature: 0.6,
      maxTokens: 2048
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
      },
      {
        id: 'workflow-designer',
        name: 'Workflow Designer',
        description: 'Designs automated workflows and processes',
        enabled: true,
      },
      {
        id: 'system-integrator',
        name: 'System Integrator',
        description: 'Suggests ways to integrate different systems and APIs',
        enabled: true,
      }
    ],
    capabilities: [
      capabilities.codeGeneration,
      capabilities.dataVisualization,
      capabilities.documentAnalysis,
      capabilities.imageAnalysis,
      capabilities.webSearch
    ],
    knowledgeSources: [
      'AI prompt engineering',
      'Data analysis techniques',
      'System integration patterns',
      'Workflow automation tools',
      'API documentation and integration guides'
    ],
    webAccess: true,
  }
];

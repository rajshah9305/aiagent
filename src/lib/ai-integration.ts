import { Agent } from '@/types';
import { LangChain } from 'langchain';
import { Crew } from 'crewai';
import { CopilotKit } from 'copilotkit';

export class AIIntegrationService {
  private langchain: LangChain;
  private crewai: Crew;
  private copilotkit: CopilotKit;

  constructor() {
    this.langchain = new LangChain();
    this.crewai = new Crew();
    this.copilotkit = new CopilotKit();
  }

  // LangChain integration methods
  async useLangChain(agent: Agent, prompt: string, context: any = {}) {
    try {
      // Configure LangChain with agent settings
      const chain = this.langchain.createChain({
        model: agent.modelConfig.model,
        temperature: agent.modelConfig.temperature,
        tools: agent.tools.filter(t => t.enabled).map(t => t.id),
        webAccess: agent.webAccess
      });

      // Execute the chain with the prompt and context
      const response = await chain.execute(prompt, context);

      return response;
    } catch (error) {
      console.error('Error using LangChain:', error);
      throw new Error('Failed to execute LangChain operation');
    }
  }

  // CrewAI integration methods
  async createAgentCrew(agents: Agent[], goal: string) {
    try {
      // Create a crew of agents
      const crew = new Crew({
        agents: agents.map(agent => ({
          name: agent.name,
          role: agent.role,
          goal: `Act as ${agent.name} from ${agent.tvReference} and ${agent.description}`,
          backstory: `You are ${agent.name}, ${agent.role}. ${agent.tagline}`,
          tools: agent.tools.filter(t => t.enabled).map(t => t.id),
          allowDelegation: true
        })),
        tasks: [
          {
            description: goal,
            expected_output: "Detailed response addressing the goal"
          }
        ],
        verbose: true
      });

      // Execute the crew task
      const result = await crew.run();

      return result;
    } catch (error) {
      console.error('Error using CrewAI:', error);
      throw new Error('Failed to execute CrewAI operation');
    }
  }

  // CopilotKit integration methods
  async setupCopilot(agent: Agent) {
    try {
      // Configure CopilotKit with agent settings
      const copilot = this.copilotkit.createCopilot({
        name: agent.name,
        description: agent.description,
        instructions: `Act as ${agent.name} from ${agent.tvReference}. ${agent.tagline}`,
        model: agent.modelConfig.model,
        temperature: agent.modelConfig.temperature,
        tools: agent.tools.filter(t => t.enabled).map(t => ({
          name: t.name,
          description: t.description
        }))
      });

      return copilot;
    } catch (error) {
      console.error('Error setting up CopilotKit:', error);
      throw new Error('Failed to set up CopilotKit');
    }
  }

  async executeCopilotAction(copilotId: string, action: string, params: any = {}) {
    try {
      const result = await this.copilotkit.executeAction(copilotId, action, params);
      return result;
    } catch (error) {
      console.error('Error executing CopilotKit action:', error);
      throw new Error('Failed to execute CopilotKit action');
    }
  }
}

export const aiIntegrationService = new AIIntegrationService();

declare module 'copilotkit' {
  export class CopilotKit {
    constructor();
    createCopilot(options: any): any;
    executeAction(copilotId: string, action: string, params: any): Promise<any>;
  }
}

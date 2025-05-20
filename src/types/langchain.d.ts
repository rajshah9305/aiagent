declare module 'langchain' {
  export class LangChain {
    constructor();
    createChain(options: any): {
      execute: (prompt: string, context: any) => Promise<string>;
    };
  }
}

declare module 'crewai' {
  export class Crew {
    constructor(options: any);
    run(): Promise<any>;
  }
}

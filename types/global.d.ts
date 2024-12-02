declare global {
  type IKeyValue = Record<string, any>;
  interface IMermaidPlatformConfig {
    NEST_SERVER_PORT: number;
  }
}

export {};

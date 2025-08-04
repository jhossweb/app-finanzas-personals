declare namespace NodeJS {
  interface ProcessEnv {
    API_PREFIX: string;
    APP_PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
  }
}
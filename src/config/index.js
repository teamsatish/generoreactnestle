const config = {
  app: {
    isLocalDevelopment: process.env.REACT_APP_IS_LOCAL_DEVELOPMENT === 'true',
    serverUrl: process.env.REACT_APP_SERVER_URL || ''
  }
}

console.log(process.env)
export const appConfig = config.app;
export default config;

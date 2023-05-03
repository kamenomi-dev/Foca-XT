type logger = import('./native/logger').default

type config = import('./launch').TBotConfig;
type client = import('icqq').Client;

declare global {
  var globalConfig: config;
  var globalClient: client;
  var globalLogger: logger;
  var globalReload: Function;
};

export {};
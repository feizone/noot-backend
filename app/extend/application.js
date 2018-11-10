'use strict';
const Logger = require('egg-logger').Logger;
const FileTransport = require('egg-logger').FileTransport;
const ConsoleTransport = require('egg-logger').ConsoleTransport;
const log = new Logger();
const chalk = require('chalk');

module.exports = {
  get logger() {
    const devEnvFalg = process.env.EGG_SERVER_ENV === 'local';

    log.set(devEnvFalg ? 'console' : 'file', devEnvFalg ? new ConsoleTransport({
      level: 'INFO',
    }) : new FileTransport({
      file: '/var/log/noot-app-backend.log',
      level: 'INFO',
    }));

    return {
      info: message => {
        log.info(chalk.green(message));
      },
      error: message => {
        log.info(chalk.yellow(message));
      },
    };
  },
};

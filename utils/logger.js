// @ts-check
const pino = require('pino').default

const logger = pino({
   transport: {
      target: 'pino-pretty',
      options: {
         colorize: true,
         timestampKey: ``
      }
   },
   base: {
      pid: false
   }
})

module.exports = logger

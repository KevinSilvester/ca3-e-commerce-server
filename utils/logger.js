const pino = require('pino')

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

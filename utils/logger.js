// @ts-check
const pino = require('pino').default

/**
 * @type {typeof import('@utils/logger')}
 */
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

import consola, { LogLevel, Consola } from 'consola'
import _ from 'lodash'

export type LoggerName = 'main' | 'webgl' | 'lifecycle'
export const loggerNames = ['main', 'webgl', 'lifecycle']

function makeLogger(name: string) {
  return consola.create({
    defaults: {
      tag: name,
    },
    level: LogLevel.Debug,
  })
}

const ALL = _.fromPairs(
  loggerNames.map((name) => [name, makeLogger(name)])
) as Record<LoggerName, Consola>

export default ALL

// import loglevel from 'loglevel'
// import * as prefixer from 'loglevel-plugin-prefix'

// loglevel.enableAll

// export const main = makeLogger('main')

// export const lifecycle = makeLogger('lifecycle')
// export const webgl = makeLogger('webgl')

// export const ALL = { main, lifecycle, webgl }
// export type LoggerTree = typeof ALL

// export type LoggerName = 'main' | 'lifecycle' | 'webgl'

// const COLORS: Record<string, (...args: any[]) => string> = {
//   TRACE: colors.magenta,
//   DEBUG: colors.green,
//   INFO: colors.black,
//   WARN: colors.yellow,
//   ERROR: colors.red,
// }

// const PREFIX_OPTS: prefixer.LoglevelPluginPrefixOptions = {
//   format(level, name, ts) {
//     const parts = [
//       colors.grey(`[${ts}]`),
//       COLORS[level](level.toLowerCase),
//       colors.green(`${name}: sss`),
//     ]
//     return parts.join(' ')
//   },
// }

// function makeLogger(
//   name?: LoggerName,
//   level: loglevel.LogLevelDesc = DEFAULT_LOG_LEVEL
// ) {
//   let logger = loglevel.getLogger(name)
//   logger.setLevel(level)
//   logger = prefixer.apply(logger, PREFIX_OPTS)

//   return logger
// }

// Object.entries(ALL).forEach(([k, v]) => ((<any>makeLogger)[k] = v))

// export default makeLogger as typeof makeLogger & LoggerTree

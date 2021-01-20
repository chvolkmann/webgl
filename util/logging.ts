import consola, { LogLevel } from 'consola'

export const ALL = {
  main: makeLogger('main'),
  lifecycle: makeLogger('lifecycle'),
  webgl: makeLogger('webgl'),
}
export type LoggerName = typeof ALL

function makeLogger(name: string, level = LogLevel.Debug) {
  return consola.create({
    defaults: {
      tag: name,
    },
    level,
  })
}

export default ALL

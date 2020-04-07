import { exception } from './analytics'
import {
  DEBUG,
  INFO,
  WARN,
  ERROR
} from '../constants/logLevels'

const debug = (context) => {
  if (process.env.NODE_ENV === 'development') console.log(context.id, context)
}

const info = (context) => console.log(context.id, context)
const warn = (context) => console.warn(context.id, context)
const error = (context) => {
  console.error(context.id, context)
  exception({ description: context.description, fatal: !!context.fatal, args: context.args || [], error: context.error })
}

const levels = {
  [DEBUG]: debug,
  [INFO]: info,
  [WARN]: warn,
  [ERROR]: error
}

const log = (level, context) => {
  const levelCB = levels[level] || info
  levelCB(context)
}

export default {
  log,
  debug,
  info,
  warn,
  error
}

const tag = '[ExtraJS]'
const verbose = true

export const log = (...args) => {
  if (!verbose) return
  console.log.apply(console, [tag].concat(args))
}

export const error = (...args) => {
  console.error.apply(console, [tag].concat(args))
}

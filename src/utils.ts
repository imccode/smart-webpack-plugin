import { isIPv4 } from 'net'
import { networkInterfaces } from 'os'
import { Entry, EntryFunc } from 'webpack'

/**
 * 获取本机ip数组
 */
const localIps = (): string[] => {
  let ips = []
  const networks = networkInterfaces()
  Object.values(networks).forEach(item => {
    item.forEach(({ address }) => {
      if (isIPv4(address) && address !== '127.0.0.1') {
        ips.push(address)
      }
    })
  })
  return ips
}

/**
 * 构造一个新的entry
 */
const structureEntry = (entry: string | string[] | Entry | EntryFunc, firstModule: string) => {
  if (typeof entry === 'string') {
    return [firstModule, entry]
  } else if (Array.isArray(entry)) {
    return [firstModule, ...entry]
  } else if (typeof entry === 'function') {
    // @ts-ignore
    return () => structureEntry(entry(), firstModule)
  }

  const newEntry = {}

  Object.keys(entry).forEach(key => {
    newEntry[key] = structureEntry(entry[key], firstModule)
  })

  return newEntry
}

/**
 * entry是否包含 条件module
 */
const includesEntry = (entry: string | string[] | Entry | EntryFunc, module: string) => {
  if (typeof entry === 'string' || Array.isArray(entry)) {
    return entry.includes(module)
  } else if (typeof entry === 'function') {
    // @ts-ignore
    return includesEntry(entry(), module)
  }

  for (let i = 0, len = Object.keys(entry).length; i < len; i++) {
    if (includesEntry(entry[i], module)) return true
  }
  return false
}

export { localIps, structureEntry, includesEntry }

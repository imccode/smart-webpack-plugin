import { networkInterfaces } from 'os'
import { isIPv4 } from 'net'

/**
 * 获取本机ip数组
 */
const localIps = (): string[] => {
  let ips = []
  const networks = networkInterfaces()
  Object.values(networks).forEach(item => {
    item.forEach(({ address }) => {
      if (isIPv4(address)) {
        ips.push(address)
      }
    })
  })
  return ips
}

export { localIps }

import { LintWebpackPluginOptions } from 'types'

const options: LintWebpackPluginOptions = {
  fix: true,
  eslint: {
    fix: true,
    enable: true
  },
  stylint: {
    fix: true,
    enable: true
  }
}

export default options

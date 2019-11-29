import { LintWebpackPluginOptions } from 'index'

const options: LintWebpackPluginOptions = {
  fix: true,
  eslint: {
    fix: true
  },
  stylelint: {
    fix: true
  }
}

export default options

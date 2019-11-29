import transformErrors from 'friendly-errors-webpack-plugin/src/core/transformErrors'
import babelSyntax from 'friendly-errors-webpack-plugin/src/transformers/babelSyntax'
import moduleNotFound from 'friendly-errors-webpack-plugin/src/transformers/moduleNotFound'
import esLintError from 'friendly-errors-webpack-plugin/src/transformers/esLintError'
import friendlyUtils from 'friendly-errors-webpack-plugin/src/utils'

const defaultTransformers = [babelSyntax, moduleNotFound, esLintError]

const transformers = friendlyUtils.concat(defaultTransformers, [])

export default (errors: any[]) => {
  const processedErrors: Array<{ message: string }> = transformErrors(errors, transformers)
  return processedErrors.map(({ message }) => message).join('\n')
}

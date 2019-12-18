import chalk from 'chalk'
import textTable from 'text-table'

type Results = Array<{
  filePath: string
  messages: Array<{
    column: number
    line: number
    message: string
    ruleId: string
    fatal: boolean
    severity: number
  }>
}>

const format = (results: Results) => {
  let output = ''
  results.forEach(result => {
    output += textTable(
      result.messages.map(({ line, column, message, ruleId, fatal, severity }) => {
        const isError = fatal || severity === 2
        return [
          chalk.bold(`Line ${line}:${column}`),
          message,
          chalk.underline[isError ? 'red' : 'yellow'](ruleId || '')
        ]
      }),
      {
        align: ['l', 'l', 'l']
      }
    )
    output += '\n'
  })

  return output
}

export default format

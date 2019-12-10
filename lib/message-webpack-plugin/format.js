"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const friendlySyntaxErrorLabel = 'Syntax error:';
const friendlyParsingErrorLabel = 'Parsing error:';
const hasError = (message) => message.includes(friendlySyntaxErrorLabel) || message.includes(friendlyParsingErrorLabel);
const lineErrorString = (label, message, line, columm) => `${chalk_1.default.bold(`Line ${line}:${columm}`)} ${label} ${message.trim()}`;
// Cleans up webpack error messages.
const formatMessage = (message) => {
    let lines = message.split('\n');
    lines = lines.filter(line => {
        if (/Module [A-z ]+\(from/.test(line))
            return false;
        if (/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm.test(line))
            return false;
        if (/^\s*at\s<anonymous>(\n|$)/gm.test(line))
            return false;
        return true;
    });
    lines = lines.map(line => {
        if (line.indexOf('Thread Loader') === 0)
            return '';
        if (line === 'SyntaxError')
            return '';
        // Line (12:2) Parsing error: a -> b
        let parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(line);
        if (parsingError) {
            const [, errorLine, errorColumn, errorMessage] = parsingError;
            return lineErrorString(friendlyParsingErrorLabel, errorMessage, errorLine, errorColumn);
        }
        // SyntaxError: ./App.js: Unexpected token, expected "{" (5:14)"
        parsingError = /(SyntaxError: )*\S+:(( \S+)*) \((\d+):(\d+)\)/.exec(line);
        if (parsingError) {
            const [, , errorMessage, , errorLine, errorColumn] = parsingError;
            return lineErrorString(friendlySyntaxErrorLabel, errorMessage, errorLine, errorColumn);
        }
        // (7:24) Unknown word
        parsingError = /^\((\d+):(\d+)\)(( \S+)*)/.exec(line);
        if (parsingError) {
            const [, errorLine, errorColumn, errorMessage] = parsingError;
            return lineErrorString(friendlySyntaxErrorLabel, errorMessage, errorLine, errorColumn);
        }
        return line;
    });
    message = lines.join('\n');
    message = message.replace(/SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g, `${friendlySyntaxErrorLabel} $3 ($1:$2)\n`);
    // Clean up export errors
    message = message.replace(/^.*export '(.+?)' was not found in '(.+?)'.*$/gm, `Attempted import error: '$1' is not exported from '$2'.`);
    message = message.replace(/^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm, `Attempted import error: '$2' does not contain a default export (imported as '$1').`);
    message = message.replace(/^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm, `Attempted import error: '$1' is not exported from '$3' (imported as '$2').`);
    lines = message.split('\n');
    if (lines.length > 2 && lines[1].trim() === '') {
        lines.splice(1, 1);
    }
    lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, '$1');
    if (lines[1] && lines[1].indexOf('Module not found: ') === 0) {
        lines = [
            lines[0],
            lines[1]
                .replace('Error: ', '')
                .replace('Module not found: Cannot find file:', 'Cannot find file:')
        ];
    }
    if (lines[1] && lines[1].match(/Cannot find module.+node-sass/)) {
        lines[1] = 'To import Sass files, you first need to install node-sass.\n';
        lines[1] += 'Run `npm install node-sass` or `yarn add node-sass` inside your workspace.';
    }
    lines[0] = chalk_1.default.cyan(lines[0] + '\n');
    message = lines.join('\n');
    lines = lines.filter((line, index, arr) => index === 0 || line.trim() !== '' || line.trim() !== arr[index - 1].trim());
    // Reassemble the message
    message = lines.join('\n');
    return message.trim();
};
function formatWebpackMessages(statsJson) {
    const formattedErrors = statsJson.errors.map(message => formatMessage(message));
    const formattedWarnings = statsJson.warnings.map(message => formatMessage(message));
    const warnings = formattedWarnings;
    let errors = formattedErrors;
    if (errors.some(hasError)) {
        errors = errors.filter(hasError);
    }
    return {
        warnings,
        errors
    };
}
exports.default = formatWebpackMessages;

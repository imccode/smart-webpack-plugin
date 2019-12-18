declare type Results = Array<{
    filePath: string;
    messages: Array<{
        column: number;
        line: number;
        message: string;
        ruleId: string;
        fatal: boolean;
        severity: number;
    }>;
}>;
declare const format: (results: Results) => string;
export default format;

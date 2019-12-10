import { Compiler } from 'webpack';
import { ServerWebpackPluginOptions } from '../types';
declare class Serve {
    private options;
    private httpServer;
    private compiler;
    constructor(options: ServerWebpackPluginOptions, compiler: Compiler);
    initServer(): void;
}
export default Serve;

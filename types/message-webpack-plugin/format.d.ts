import { Stats } from 'webpack';
declare function formatWebpackMessages(statsJson: Stats.ToJsonOutput): {
    warnings: string[];
    errors: string[];
};
export default formatWebpackMessages;

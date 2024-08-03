import LogT from 'logt';

import { isProduction } from '@/configs';

const logger = isProduction ? new LogT('none') : new LogT('info');

export default logger;

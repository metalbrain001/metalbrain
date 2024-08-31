import NodeCache from 'node-cache';

export const appCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export default { appCache };

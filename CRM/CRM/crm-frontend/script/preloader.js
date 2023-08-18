import { cnd } from './core.js';
import { svgPreloader } from './svg.js';

export const createPreloader = () => {
const preloaderBlock = cnd('span', ['preloader'], 'loader', {}, `${svgPreloader}`);

return preloaderBlock;
};

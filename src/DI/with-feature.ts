
import { useAllFeatures } from './use-feature';
import { makeWithFeatures } from '../lib/with-feature';

/**
 * The HOC allows to pass a selector which getting parameters and methods from features
 * so these values would be passed to components.
 *
 * It's an alternative of using 'useFeature' hook with containers-component
 * @param selector
 */

export const withFeature = makeWithFeatures(useAllFeatures);


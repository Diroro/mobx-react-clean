import { Footer } from './footer.component';
import { createElement } from 'react';
// import { useTaskManagerFeature } from '../../../DI/use-feature';
import { observer } from 'mobx-react';
import { useDIFeature } from '../../../DI/use-feature';
// import { withFeature } from '../../../DI/with-feature';

// so it can be used either with simpler 'useFeature' or 'withFeature' hook
export const FooterContainer = observer(() => {
	const tasksFeature = useDIFeature('TaskManagerFeature');

	return createElement(Footer, {
		activeCount: tasksFeature.activeCount,
		completedCount: tasksFeature.completedCount,
	});
});

// export const FooterContainerExample = withFeature(({TaskManager}) => ({
// 	activeCount: TaskManager.activeCount,
// 	completedCount: TaskManager.completedCount,
// }))(Footer);

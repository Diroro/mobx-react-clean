import { Footer } from './footer.component';
import { createElement } from 'react';
import { useTaskManagerFeature } from '../../../DI/use-feature';
import { observer } from 'mobx-react';
import { withFeature } from '../../../DI/with-feature';

export const FooterContainerExample = observer(() => {
	const tasksFeature = useTaskManagerFeature();

	return createElement(Footer, {
		activeCount: tasksFeature.activeCount,
		completedCount: tasksFeature.completedCount,
	});
});

export const FooterContainer = withFeature(({TaskManager}) => ({
	activeCount: TaskManager.activeCount,
	completedCount: TaskManager.completedCount,
}))(Footer);

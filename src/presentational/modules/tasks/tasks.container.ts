import { TasksList } from './tasks.component';
import { withFeature } from '../../../DI/with-feature';
import { observer } from 'mobx-react';
import { useAllFeatures } from '../../../DI/use-feature';
import { createElement } from 'react';

export const TasksContainerExample = observer(() => {
	const features = useAllFeatures();

	return createElement(TasksList, {
		tasks: features.TaskManager.tasksList,
		requestTasks: features.TaskManager.requestTasks,
	});
});

export const TasksContainer = withFeature((features) => ({
	tasks: features.TaskManager.tasksList,
	requestTasks: features.TaskManager.requestTasks,
}))(TasksList);
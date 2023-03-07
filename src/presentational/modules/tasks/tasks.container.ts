import { TasksList } from './tasks.component';
// import { withFeature } from '../../../DI/with-feature';
import { observer } from 'mobx-react';
// import { useAllFeatures } from '../../../DI/use-feature';
import { createElement } from 'react';
import { useDIFeature } from '../../../DI/di-container';
import { DependencyToken } from '../../../DI/tokens';
// import { useDIFeature } from '../../../DI/di-container';

export const TasksContainer = observer(() => {
	const TaskManager = useDIFeature(DependencyToken.TaskManagerFeature);

	return createElement(TasksList, {
		tasks: TaskManager.tasksList,
		requestTasks: TaskManager.requestTasks,
	});
});



// export const TasksContainerExample = withFeature(({TaskManager}) => ({
// 	tasks: TaskManager.tasksList,
// 	requestTasks: TaskManager.requestTasks,
// }))(TasksList);
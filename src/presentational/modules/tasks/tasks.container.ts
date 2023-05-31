import { TasksList } from './tasks.component';
import { observer } from 'mobx-react';
import { createElement } from 'react';
import { useDIFeature } from '../../../DI/use-feature';
import { Token } from '../../../DI/tokens';

export const TasksContainer = observer(() => {
	const TaskManager = useDIFeature(Token.taskManagerFeature);

	return createElement(TasksList, {
		tasks: TaskManager.tasksList,
		requestTasks: TaskManager.requestTasks,
	});
});



// export const TasksContainerExample = withFeature(({TaskManager}) => ({
// 	tasks: TaskManager.tasksList,
// 	requestTasks: TaskManager.requestTasks,
// }))(TasksList);
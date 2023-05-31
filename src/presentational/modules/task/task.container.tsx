import { TaskComponent } from './task.component';
import { createElement } from 'react';
import { useDIFeature } from '../../../DI';
import { observer } from 'mobx-react';
import { type Task } from '../../../domain/models/task.model';

// export const TaskContainerExample = withFeature(({TaskManager}) => ({
// 	onCheck: TaskManager.toggleCompleteTask,
// 	onDelete: TaskManager.removeTask,
// }))(TaskComponent);


export const TaskContainer = observer(({task}: {task: Task}) => {
	const taskManager = useDIFeature('TaskManagerFeature');

	return createElement(TaskComponent, {
		onCheck: taskManager.toggleCompleteTask,
		onDelete: taskManager.removeTask,
		task,
	});
});
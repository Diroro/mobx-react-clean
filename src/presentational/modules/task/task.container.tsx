import { TaskComponent } from './task.component';
// import { withFeature } from '../../../DI/with-feature';
import { createElement } from 'react';
import { useDIFeature } from '../../../DI/di-container';
import { observer } from 'mobx-react';
import { type Task } from '../../../domain/models/task.model';

// export const TaskContainerExample = withFeature(({TaskManager}) => ({
// 	onCheck: TaskManager.toggleCompleteTask,
// 	onDelete: TaskManager.removeTask,
// }))(TaskComponent);



export const TaskContainer = observer(({task}: {task: Task}) => {
	const TaskManager = useDIFeature('TaskManagerFeature');

	return createElement(TaskComponent, {
		onCheck: TaskManager.toggleCompleteTask,
		onDelete: TaskManager.removeTask,
		task,
	});
});
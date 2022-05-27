import { TaskComponent } from './task.component';
import { withFeature } from '../../../DI/with-feature';

export const TaskContainer = withFeature(({TaskManager}) => ({
	onCheck: TaskManager.toggleCompleteTask,
	onDelete: TaskManager.removeTask,
}))(TaskComponent);

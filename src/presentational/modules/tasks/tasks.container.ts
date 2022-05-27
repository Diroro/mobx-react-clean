import { TasksList } from './tasks.component';
import { withFeature } from '../../../DI/with-feature';

export const TasksContainer = withFeature((features) => ({
	tasks: features.TaskManager.tasksList,
	requestTasks: features.TaskManager.requestTasks,
}))(TasksList);
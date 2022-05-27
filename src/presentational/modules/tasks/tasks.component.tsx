import { useEffect } from 'react';
import { TasksStyled } from './tasks.styled';
import { TaskContainer } from '../task/task.container';
import { Task } from '../../../domain/models/task.model';
import { observer } from 'mobx-react';

export interface TasksProps {
	readonly tasks: Task[];
	readonly requestTasks: () => void;
}

export const TasksList = observer(({tasks, requestTasks}: TasksProps) => {
	useEffect(requestTasks, [requestTasks])

	return (
		<TasksStyled>
			{tasks.map(task => (
				<TaskContainer task={task} key={task.id} />
			))}
		</TasksStyled>
	);
});

import { observer } from 'mobx-react';
import { useCallback } from 'react';
import { Task } from '../../../domain/models/task.model';
import { DestroyStyled, TaskStyled, ToggleLabelStyled, ToggleStyled, ViewStyled } from './task.styled';

export interface TaskProps {
	task: Task;
	readonly onCheck: (id: string, value: boolean) => void;
	readonly onDelete: (id: string) => void;
}

export const TaskComponent = observer((props: TaskProps) => {
	const { onCheck, task, onDelete } = props;
	const {id, completed, title} = task;

	const isInEditMode = false;
	const onEditModeEnter = () => {}
	const handleCheck = useCallback(() => onCheck(id, !completed), [id, completed, onCheck]);
	const handleDelete = useCallback(() => onDelete(id), [onDelete, id]);

	return (
		<TaskStyled isCompleted={completed} isInEditMode={isInEditMode}>
			<ViewStyled>
				<ToggleStyled checked={completed} onChange={handleCheck} />
				<ToggleLabelStyled onDoubleClick={onEditModeEnter}>{title}</ToggleLabelStyled>
				<DestroyStyled onClick={handleDelete} />
			</ViewStyled>
			{/* <EditStyled value={title} onChange={handleInput} autoFocus={isInEditMode} /> */}
		</TaskStyled>
	);
});

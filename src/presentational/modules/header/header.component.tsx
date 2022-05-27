import { KeyboardEventHandler, useCallback, useState } from 'react';
import { HeadingStyled } from './header.styled';
import { observer } from 'mobx-react';
import { TextInput } from '../../common/text-input/text-input.component';
import styled from 'styled-components';

// MOVE TO ANOTHER COMPONENT
export const TodoInput = styled(TextInput)`
	padding: 16px 16px 16px 60px;
	border: none;
	background: rgba(0, 0, 0, 0.003);
	box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
`;

export interface HeaderComponentProps {
	readonly addTask: (value: string) => void;
}

export const HeaderComponent = observer(({ addTask }: HeaderComponentProps) => {
	const [taskText, setTaskText] = useState('');

	const handleKeyUp: KeyboardEventHandler = useCallback(
		e => {
			if (e.keyCode === 13 && taskText.trim() !== "") {
				addTask(taskText.trim());
				setTaskText('');
			}
		},
		[addTask, taskText],
	);

	return (
		<header>
			<HeadingStyled>todos</HeadingStyled>
			<TodoInput
				autoFocus
				placeholder={'What needs to be done?'}
				name={'newTodo'}
				value={taskText}
				onChange={setTaskText}
				onKeyUp={handleKeyUp}
			/>
		</header>
	);
});



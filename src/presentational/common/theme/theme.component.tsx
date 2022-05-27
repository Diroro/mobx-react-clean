import { observer } from 'mobx-react';
import React, { memo, ReactNode } from 'react';
import { ThemeStyled } from './theme.styled';

export interface ThemeProps {
	readonly children: ReactNode;
}

export const Theme = observer((props: ThemeProps) => {
	const { children } = props;
	return (
		<>
			<ThemeStyled />
			{children}
		</>
	);
});

import { observer } from 'mobx-react';
import { LinkStyled } from './link.styled';

export interface LinkProps {
	readonly label: string;
	readonly path: string;
	readonly isActive?: boolean;
}

export const LinkComponent = observer(({isActive = false, path, label}: LinkProps) => {
	return (
		<LinkStyled isActive={isActive} href={`#${path}`}>
			{label}
		</LinkStyled>
	);
});

import {
	ClearCompletedStyled,
	FiltersStyled,
	FilterStyled,
	FooterStyled,
	TodoCountStyled,
	TodoCountValueStyled,
} from './footer.styled';
import { LinkComponent } from '../link/link.component';
import { observer } from 'mobx-react';

export interface FooterProps {
	readonly activeCount: number;
	readonly completedCount: number;
}

export const Footer = observer((props: FooterProps) => {
	const { completedCount, activeCount } = props;

	return (
		<FooterStyled>
			<TodoCountStyled>
				<TodoCountValueStyled>{activeCount}</TodoCountValueStyled> item{activeCount !== 1 ? 's' : ''}
			</TodoCountStyled>
			<FiltersStyled>
				<FilterStyled>
					<LinkComponent path={'/'} label={'All'} />
				</FilterStyled>
				<FilterStyled>
					<LinkComponent path={'/active'} label={'Active'} />
				</FilterStyled>
				<FilterStyled>
					<LinkComponent path={'/completed'} label={'Completed'} />
				</FilterStyled>
			</FiltersStyled>
			{completedCount > 0 && <ClearCompletedStyled>Clear completed</ClearCompletedStyled>}
		</FooterStyled>
	);
});

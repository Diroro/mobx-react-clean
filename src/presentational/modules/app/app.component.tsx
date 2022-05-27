import { Theme } from '../../common/theme/theme.component';
import { AppStyled } from './app.styled';
import { HeaderContainer } from '../header/header.container';
import { FooterContainer } from '../footer/footer.container';
import { memo } from 'react';
import { TasksContainer } from '../tasks/tasks.container';

export const AppComponent = memo(() => (
	<Theme>
		<AppStyled>
			<HeaderContainer />
			<TasksContainer />
			<FooterContainer />
		</AppStyled>
	</Theme>
));

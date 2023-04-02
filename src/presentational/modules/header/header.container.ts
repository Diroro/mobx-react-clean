import { HeaderComponent } from './header.component';
import { withFeature } from '../../../DI/with-feature';
import { observer } from 'mobx-react';
// import { useTaskManagerFeature } from '../../../DI/use-feature';
import { createElement } from 'react';
import { useDIFeature } from '../../../DI/di-container';

export const HeaderContainer = observer(() => {
	const {addTask} = useDIFeature('TaskManagerFeature');
	
	return createElement(HeaderComponent, {addTask});
});

export const HeaderContainerExample = withFeature((features) => ({addTask: features.TaskManagerFeature.addTask}))(HeaderComponent);



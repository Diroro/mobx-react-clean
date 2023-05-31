import { HeaderComponent } from './header.component';
import { observer } from 'mobx-react';
import { createElement } from 'react';
import { useDIFeature, withFeature } from '../../../DI';

export const HeaderContainer = observer(() => {
	const {addTask} = useDIFeature('TaskManagerFeature');
	
	return createElement(HeaderComponent, {addTask});
});

export const HeaderContainerExample = withFeature((features) => ({addTask: features.TaskManagerFeature.addTask}))(HeaderComponent);



import { HeaderComponent } from './header.component';
import { withFeature } from '../../../DI/with-feature';

export const HeaderContainer = withFeature((features) => ({addTask: features.TaskManager.addTask}))(HeaderComponent);



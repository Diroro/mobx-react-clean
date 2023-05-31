// import { Container, injectable } from 'inversify'
import { makeAutoObservable } from 'mobx';
import { TaskServiceImpl } from '../data/services/task.service';
import { ErrorsStoreImpl } from '../data/stores/errors.store';
import { TaskStoreImpl } from '../data/stores/task.store';
import { TaskService } from '../domain/feature-dependencies/services/task.service.dependency';
import { ErrorsStore } from '../domain/feature-dependencies/stores/errors-store.dependency';
import { TaskStore } from '../domain/feature-dependencies/stores/task-store.dependency';
import {
	TaskManagerFeature,
	TaskManagerFeatureImpl,
} from '../domain/features/task-manager.feature';

import { Token, FeatureDependencyKey } from './tokens';
import { buildContainer } from '../lib/my-di';

export const createApp = () => {
	const container = buildContainer()
		.bind<typeof Token.taskService, TaskService>(
			Token.taskService,
			TaskServiceImpl
		)
		.bind<typeof Token.taskStore, TaskStore>(
			Token.taskStore,
			TaskStoreImpl
		)
		.bind<typeof Token.errorsStore, ErrorsStore>(
			Token.errorsStore,
			ErrorsStoreImpl
		)
		.bind<typeof Token.taskManagerFeature, TaskManagerFeature>(
			Token.taskManagerFeature,
			TaskManagerFeatureImpl
		)
		.build((map) => {
			map.forEach((value) => {
				makeAutoObservable(value);
			});
		});

	const wholeContainer = container.getContainer();

	const useDIFeature = <Key extends FeatureDependencyKey>(
		token: Key
	): (typeof wholeContainer)[Key] => {
		const feature = wholeContainer[token];

		return feature;
	};

	const useAllFeatures = () => {
		return wholeContainer;
	};

	return {
		useDIFeature,
		useAllFeatures,
	};
};


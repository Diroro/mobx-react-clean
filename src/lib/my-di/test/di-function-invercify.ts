// import { Container } from 'inversify';

// type Klass<Interface = any> = new (...args: any[]) => Interface;

// interface ContainerBuilder<Box extends { [key: string]: unknown } = never> {
// 	/**
// 	 * binds key and interface to an instance
// 	 * @param key
// 	 * @param t
// 	 */
// 	bind<Key extends string, T>(
// 		key: Key,
// 		t: Klass<T>
// 	): ContainerBuilder<Box & Record<Key, T>>;

// 	build(
// 		builder: UnsafeDIContainer,
// 		onBind?: <Key extends keyof Box>(key: Key, value: Box[Key]) => void
// 	): CleanContainer<Box>;
// }

// interface CleanContainer<Box extends { [key: string]: unknown } = never> {
// 	getItem<Key extends keyof Box>(key: Key): Box[Key];
// 	getKeys(): { [K in keyof Box]: K };
// 	getContainer(): Box;
// }

// type KlassBox<Box> = { [key in keyof Box]: Klass<Box[key]> };

// export type UnsafeDIContainer<Box extends { [key: string]: unknown } = {}> = (
// 	box: Box
// ) => {
// 	// bind: (key: string, value: unknown) => void;
// 	resolve: () => Map<keyof Box, unknown>;
// 	get: (key: string) => unknown;
// };

// export const buildContainer = <Box extends { [key: string]: unknown } = {}>(
// 	box: KlassBox<Box> = {} as KlassBox<Box>
// ): ContainerBuilder<Box> => {
// 	const bind = <Key extends string, T>(
// 		key: Key,
// 		value: Klass<T>
// 	): ContainerBuilder<Box & Record<Key, T>> => {
// 		const newBox = { ...box, [key]: value } as KlassBox<Box & Record<Key, T>>;
// 		return buildContainer(newBox);
// 	};

// 	const build = (
// 		builder: UnsafeDIContainer,
// 		onBind?: <Key extends keyof Box>(key: Key, value: Box[Key]) => void
// 	) => {
// 		const resolved = builder(box).resolve();

// 		const getContainer = () => {
// 			const values = Object.keys(box).reduce(
// 				(prev, key: keyof Box) => {
// 					prev[key] = resolved.get(key) as Box[typeof key];

// 					return prev;
// 				},
// 				{} as {
// 					[K in keyof Box]: Box[K];
// 				}
// 			);

// 			return values;
// 		};

// 		const container = getContainer();
// 		for (const [key, value] of Object.entries(container)) {
// 			// onBind?.(container)
// 			onBind?.(key, value);
// 		}

// 		const getItem = <Key extends keyof Box>(key: Key): Box[Key] => {
// 			//   const item = container.get(key as string)

// 			const item = resolved.get(key as any) as Box[Key];
// 			return item;
// 		};

// 		const getKeys = (): { [K in keyof Box]: K } => {
// 			const keys = Object.keys(box).reduce(
// 				(prev, current) => ({ ...prev, [current]: current }),
// 				{} as { [K in keyof Box]: K }
// 			);

// 			return keys;
// 		};

// 		return {
// 			getItem,
// 			getKeys,
// 			getContainer,
// 		};
// 	};

// 	return {
// 		bind,
// 		build,
// 	};
// };

export const temp = 1;
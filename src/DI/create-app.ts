// import { Container, injectable } from 'inversify'
// import { makeAutoObservable } from 'mobx';
// import { DependenciesMapGeneral, AppConfig, KlassType } from './create-config';

export const temp = 1;

// export const createApp = <
//     DependenciesMap extends DependenciesMapGeneral,
// >(
//     config: AppConfig<
//         DependenciesMap
//     >,
// ) => {
//     type BaseDependencyKey = keyof DependenciesMap['services'];
//     type FeatureDependencyKey = keyof DependenciesMap['features'];
//     type DependencyKey = BaseDependencyKey | FeatureDependencyKey

//     const containerDI = new Container({
//         autoBindInjectable: true,
//         defaultScope: 'Singleton',
//     })
//     const { services, features, tokens } = config

//     const allDependencies = ({ ...services, ...features } as unknown) as Record<
//         DependencyKey,
//         KlassType<DependencyKey>
//     >

//     Object.entries(allDependencies).forEach(([key, dep]) => {
//         const depKey = key as unknown as DependencyKey
//         const dependency = dep as any
//         containerDI.bind(tokens[depKey as any]).to(dependency).onActivation((_, injectable) => {
//             makeAutoObservable(injectable as object);
//             return injectable;
//         });
//     })

//     type FeatureDependency<Key extends FeatureDependencyKey> = DependenciesMap['features'][Key];

//     const useDIFeature = <Key extends FeatureDependencyKey>(token: Key): FeatureDependency<Key> => {
//         const feature = containerDI.get<FeatureDependency<Key>>(
//             token as any,
//         );

//         return feature
//     }

//     type AllFeatures = DependenciesMap['features'];
    
//     const allFeatures: AllFeatures = Object.keys(config.features).reduce((deps, key) => {
//         const dep = containerDI.get(key);

//         deps[key as any] = dep;
//         return deps
//     }, {} as any);
//     const useAllFeatures = () => {
//         return allFeatures;
//     }

//     return { useDIFeature, useAllFeatures }
// }








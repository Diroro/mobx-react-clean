export type KlassType<Result> = { new (...variables: any[]): Result }

export type DependenciesMapGeneral<
  ServiceDependencyKey extends string | number | symbol = string,
  FeatureDependencyKey extends string | number | symbol = string
> = {
  services: Record<ServiceDependencyKey, unknown>
  features: Record<FeatureDependencyKey, unknown>
}

// type ServicesDependencies<
// DependenciesMap extends DependenciesMapGeneral
// > =
export type AppConfig<
  ServiceKeys extends string | number | symbol,
  FeatureKeys extends string | number | symbol,
  DependenciesMap extends DependenciesMapGeneral<ServiceKeys, FeatureKeys>
> = {
  readonly services: Record<
    ServiceKeys,
    KlassType<DependenciesMap['services'][keyof DependenciesMap['services']]>
  >
  readonly features: Record<
    keyof DependenciesMap['features'],
    KlassType<DependenciesMap['features'][keyof DependenciesMap['features']]>
  >

  readonly tokens: Record<ServiceKeys, ServiceKeys> &
    Record<keyof DependenciesMap['features'], keyof DependenciesMap['features']>
}

type ServicesOption<Keys extends string, Services> = Record<
  Keys,
  KlassType<Services>
>
type FeaturesOption<Keys extends string, Features> = Record<
  Keys,
  KlassType<Features>
>

export const createConfig = <
  // ServicesKeys = keyof DependenciesMap['services'],
  // 	FeaturesKeys = keyof DependenciesMap['features'],
  // ServicesKeys extends string,
  // 	FeaturesKeys = extends string,
  DependenciesMap extends DependenciesMapGeneral<
    string | number | symbol,
    string | number | symbol
  >
>(
  servicesOption: Record<
    keyof DependenciesMap['services'],
    KlassType<DependenciesMap['services'][keyof DependenciesMap['services']]>
  >,
  featuresOption: Record<
    keyof DependenciesMap['features'],
    KlassType<DependenciesMap['features'][keyof DependenciesMap['features']]>
  >,
  tokens: Record<
    keyof DependenciesMap['services'],
    keyof DependenciesMap['services']
  > &
    Record<
      keyof DependenciesMap['features'],
      keyof DependenciesMap['features']
    >,
): AppConfig<
  keyof DependenciesMap['services'],
  keyof DependenciesMap['features'],
  DependenciesMap
> => {
  return {
    services: servicesOption,
    features: featuresOption,
    tokens,
  }
}

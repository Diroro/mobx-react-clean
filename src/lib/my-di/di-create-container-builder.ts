import { DIResolverWithKeysChecker } from './di-resolver-with-key-checker'

type Klass<Interface = any> = new (...args: any[]) => Interface

interface ContainerBuilder<Box extends { [key: string]: unknown } = never> {
  /**
   * binds key and interface to an instance
   * @param key
   * @param t
   */
  bind<Key extends string, T>(
    key: Key,
    t: Klass<T>,
  ): ContainerBuilder<Box & Record<Key, T>>

  build(
    onCreate?: (container: Map<keyof Box, Box[keyof Box]>) => void,
  ): CleanContainer<Box>
}

interface CleanContainer<Box extends { [key: string]: unknown } = never> {
  getItem<Key extends keyof Box>(key: Key): Box[Key]
  getKeys(): { [K in keyof Box]: K }
  getContainer(): Box
}

type KlassBox<Box> = { [key in keyof Box]: Klass<Box[key]> }

// class ContainerBuilderImpl<Box extends { [key: string]: unknown } = never>
//   implements ContainerBuilder<Box> {
//   constructor(private readonly box: KlassBox<Box>) {}

//   public readonly bind = <Key extends string, T>(
//     key: Key,
//     value: Klass<T>,
//   ): ContainerBuilder<Box & Record<Key, T>> => {
//     const newBox = { ...this.box, [key]: value } as KlassBox<
//       Box & Record<Key, T>
//     >
//     return new ContainerBuilderImpl(newBox)
//   }

//   public readonly build = (onCreate?: (container: Map<keyof Box, Box[keyof Box]>) => void) => {
//     const classesList = Object.values(this.box)
//     const container = resolveDI(classesList)
//     onCreate?.(container as Map<keyof Box, Box[keyof Box]>)

//     const getItem = <Key extends keyof Box>(key: Key): Box[Key] => {
//       const item = container.get(key as string)
//       return item as Box[Key]
//     }

//     const getKeys = (): { [K in keyof Box]: K } => {
//       const keys = Object.keys(this.box).reduce(
//         (prev, current) => ({ ...prev, [current]: current }),
//         {} as { [K in keyof Box]: K },
//       )

//       return keys
//     }

//     const getContainer = () => {
//       const values = Object.fromEntries(container) as Box

//       return values
//     }

//     return {
//       getItem,
//       getKeys,
//       getContainer,
//     }
//   }
// }

export const createContainerBuilder = <Box extends { [key: string]: unknown } = {}>(
  box: KlassBox<Box> = {} as KlassBox<Box>,
): ContainerBuilder<Box> => {
  const bind = <Key extends string, T>(
    key: Key,
    value: Klass<T>,
  ): ContainerBuilder<Box & Record<Key, T>> => {
    const newBox = { ...box, [key]: value } as KlassBox<Box & Record<Key, T>>
    return createContainerBuilder(newBox)
  }

  const build = (
    onCreate?: (container: Map<keyof Box, Box[keyof Box]>) => void,
  ) => {
    // const classesList = Object.values(box)
    // const resolver = new DIResolver(classesList);
    const resolverWithChecker = new DIResolverWithKeysChecker(box)
    const container = resolverWithChecker.resolve()
    onCreate?.(container as Map<keyof Box, Box[keyof Box]>)

    const getItem = <Key extends keyof Box>(key: Key): Box[Key] => {
      const item = container.get(key as string)
      return item as Box[Key]
    }

    const getKeys = (): { [K in keyof Box]: K } => {
      const keys = Object.keys(box).reduce(
        (prev, current) => ({ ...prev, [current]: current }),
        {} as { [K in keyof Box]: K },
      )

      return keys
    }

    const getContainer = () => {
      const values = Object.fromEntries(container) as {
        [K in keyof Box]: Box[K]
      }

      return values
    }

    return {
      getItem,
      getKeys,
      getContainer,
    }
  }

  return {
    bind,
    build,
  }
}

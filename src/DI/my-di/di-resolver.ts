import { INJECTABLE_TOKEN_KEY, INJECT_KEY } from './decorators'
import 'reflect-metadata'

type Klass<Interface = any> = new (...args: any[]) => Interface

export const resolveDI = <T extends Klass[]>(classes: T) => {
  const constructors = new Map()
  const allKeys: string[] = []
  const instancesContainer = new Map<string, T[number]>()

  for (const klass of classes) {
    const injectableKey = Reflect.getMetadata(INJECTABLE_TOKEN_KEY, klass)
    constructors.set(injectableKey, klass)
    allKeys.push(injectableKey)
  }

  // just in case if something is not found after many checks, we stop the loop and write
  // THINK HOW MANY LOOPS SHOULD WE GO. Probably depending on class number?
  // CALCULATE THIS LOOPS NUMBER IN CLEVER CASE

  // just in case if something is not found after many checks, we stop the loop and write
  // THINK HOW MANY LOOPS SHOULD WE GO. Probably depending on class number?
  // CALCULATE THIS LOOPS NUMBER IN CLEVER CASE
  let currentIterationNumber = 0
  const MAX_LOOPS_NUMBER = 100
  // @TODO OR may be check that after the whole loop the allKeys number is not changed? twice?
  let i = 0

  // just thrown an error if  currentIterationNumber < MAX_LOOPS_NUMBER ?
  // OR better after it check if allKeys still has something,
  outerLoop: while (
    allKeys.length > 0 &&
    currentIterationNumber < MAX_LOOPS_NUMBER
  ) {
    // it means that not every instance is already added to container
    // we're going from start again
    if (i >= allKeys.length) {
      i = 0
    }
    const klassKey = allKeys[i]
    const klassConstructor = constructors.get(klassKey)

    if (!klassConstructor) {
      break
    }

    const constructorKeys = Reflect.getMetadataKeys(
      klassConstructor,
    ).filter((item: string) => item.startsWith(INJECT_KEY))
    constructorKeys.reverse()

    if (constructorKeys.length === 0) {
      const instance = new klassConstructor()
      instancesContainer.set(klassKey, instance)
      allKeys.splice(i, 1)
      // we are going to the next constructor
      // no needs to increase 'i' value as we decrease allKeys array
      continue
    }

    const instancesToInject = []
    for (const key of constructorKeys) {
      const injectKey = Reflect.getMetadata(key, klassConstructor)
      const instanceToInject = instancesContainer.get(injectKey)

      if (!instanceToInject) {
        // we skip a constructor and wait for all instances appear
        i++
        currentIterationNumber++
        continue outerLoop
      }
      instancesToInject.push(instanceToInject)
    }

    const instance = new klassConstructor(...instancesToInject)
    instancesContainer.set(klassKey, instance)
    allKeys.splice(i, 1)

    i++
    currentIterationNumber++
  }

  return instancesContainer
}

export class DIResolver<A, T extends Klass<A>[]> {
  constructor(private readonly classes: T) {}
  private allKeys: string[] = []
  private constructors: Map<string, Klass<A>> = new Map()
  private instancesContainer = new Map<string, A>()
  private notFoundInjectKeys = new Set<string>()

  private removeKey = (keyIndex: number) => {
    this.allKeys.splice(keyIndex, 1)
  }

  private addConstructorAndKeys = (klass: Klass<A>) => {
    const injectableKey = Reflect.getMetadata(INJECTABLE_TOKEN_KEY, klass)
    this.constructors.set(injectableKey, klass)
    this.allKeys.push(injectableKey)
  }

  private getConstructorKeys = (klassConstructor: Klass<A>): string[] => {
    const constructorKeys = Reflect.getMetadataKeys(klassConstructor)
      .filter((item: string) => item.startsWith(INJECT_KEY))
      .map((token) => Reflect.getMetadata(token, klassConstructor))
    constructorKeys.reverse()

    return constructorKeys
  }

  private createInstanceWithoutParams = (
    key: string,
    keyIndex: number,
    item: Klass<A>,
  ) => {
    const instance = new item()
    this.instancesContainer.set(key, instance)
    this.removeKey(keyIndex)
  }

  public readonly resolve = () => {
    this.classes.forEach(this.addConstructorAndKeys)
    let i = 0

    // just in case if something is not found after many checks, we stop the loop and write
    // THINK HOW MANY LOOPS SHOULD WE GO. Probably depending on class number?
    // CALCULATE THIS LOOPS NUMBER IN CLEVER CASE
    let currentIterationNumber = 0
    const MAX_LOOPS_NUMBER = 100
    // @TODO OR may be check that after the whole loop the allKeys number is not changed? twice?

    // just thrown an error if  currentIterationNumber < MAX_LOOPS_NUMBER ?
    // OR better after it check if allKeys still has something,
    outerLoop: while (
      this.allKeys.length > 0 &&
      currentIterationNumber < MAX_LOOPS_NUMBER
    ) {
      // it means that not every instance is already added to container
      // we're going from start again
      if (i >= this.allKeys.length) {
        i = 0
      }
      const klassKey = this.allKeys[i]
      const klassConstructor = this.constructors.get(klassKey)

      if (!klassConstructor) {
        break
      }

      const constructorKeys = this.getConstructorKeys(klassConstructor)

      if (constructorKeys.length === 0) {
        this.createInstanceWithoutParams(klassKey, i, klassConstructor)
        // we are going to the next constructor
        // no needs to increase 'i' value as we decrease allKeys array
        continue
      }

      const instancesToInject = []
      for (const injectKey of constructorKeys) {
        const instanceToInject = this.instancesContainer.get(injectKey)

        if (!instanceToInject) {
          // we skip a constructor and wait for all instances appear
          // we should save it? in SET maybe? and remove it from set when it's found
          this.notFoundInjectKeys.add(injectKey)
          // think how to add other keys
          i++
          currentIterationNumber++
          continue outerLoop
        } else {
          this.notFoundInjectKeys.delete(injectKey)
          instancesToInject.push(instanceToInject)
        }
      }

      const createdKlass = new klassConstructor(...instancesToInject)
      this.instancesContainer.set(klassKey, createdKlass)
      this.removeKey(i)

      i++
      currentIterationNumber++
    }

    if (this.notFoundInjectKeys.size) {

      // @TODO found more keys! save it somehow
      throw new Error(
        `No injectable found for constructor keys: ${Array.from(
          this.notFoundInjectKeys,
        )
          .map((key) => `"${key}"`)
          .join(', ')}.`,
      )
    }
    return this.instancesContainer
  }
}


export class DIResolverWithKeysChecker<
  A,
  Key extends string,
  T extends Record<Key, Klass<A>>
> {
  constructor(private readonly klasses: T) {}

  private allKeys: string[] = []
  private constructors: Map<string, Klass<A>> = new Map()
  private instancesContainer = new Map<string, A>()
  private notFoundInjectKeys = new Set<string>()

  private removeKey = (keyIndex: number) => {
    this.allKeys.splice(keyIndex, 1)
  }

  private addConstructorAndKeys = (key: string, klass: Klass<A>) => {
    // check the case when decorator is not added! may be throw an error
    const injectableKey = this.resolveInjectableKey(key, klass)
    this.constructors.set(injectableKey, klass)
    this.allKeys.push(injectableKey)
  }

  private resolveInjectableKey = (key: string, klass: Klass<A>) => {
    const injectableKey = Reflect.getMetadata(INJECTABLE_TOKEN_KEY, klass)
	console.log('RESOLVED KEY: ', injectableKey);
    if (injectableKey !== key) {
      throw new Error(
        `A key "${key}" provided to the class "${klass.name}" does not correspond to a key in @MakeInjectable decorator: "${injectableKey}".`,
      )
    }

    return injectableKey
  }

  private getConstructorKeys = (klassConstructor: Klass<A>): string[] => {
	if (klassConstructor.name === 'TaskManagerFeatureImpl') {
		console.log('ADDING TO WINDOW: ');
		(window  as any)['TaskManagerFeatureImpl'] = klassConstructor
	}
	console.log('CONSTRUCTOR INITIAL KEYS: ',klassConstructor.name, Reflect.getMetadataKeys(klassConstructor));
    const constructorKeys = Reflect.getMetadataKeys(klassConstructor)
      .filter((item: string) => item.startsWith(INJECT_KEY))
      .map((token) => Reflect.getMetadata(token, klassConstructor))

    constructorKeys.reverse()

    return constructorKeys
  }

  private createInstanceWithoutParams = (
    key: string,
    keyIndex: number,
    item: Klass<A>,
  ) => {
    const instance = new item()
    this.instancesContainer.set(key, instance)
    this.removeKey(keyIndex)
  }

  public readonly resolve = () => {
    Object.entries(this.klasses).forEach(([key, klass]) => {
      this.addConstructorAndKeys(key, klass as T[Key])
    })

    let i = 0
    // just in case if something is not found after many checks, we stop the loop and write
    // THINK HOW MANY LOOPS SHOULD WE GO. Probably depending on class number?
    // CALCULATE THIS LOOPS NUMBER IN CLEVER CASE
    let currentIterationNumber = 0
    const MAX_LOOPS_NUMBER = 100
    // @TODO OR may be check that after the whole loop the allKeys number is not changed? twice?

    // just thrown an error if  currentIterationNumber < MAX_LOOPS_NUMBER ?
    // OR better after it check if allKeys still has something,
    outerLoop: while (
      this.allKeys.length > 0 &&
      currentIterationNumber < MAX_LOOPS_NUMBER
    ) {
      // it means that not every instance is already added to container
      // we're going from start again
      if (i >= this.allKeys.length) {
        i = 0
      }
      const klassKey = this.allKeys[i]
      const klassConstructor = this.constructors.get(klassKey)

      if (!klassConstructor) {
        break
      }
      const constructorKeys = this.getConstructorKeys(klassConstructor)

	  console.log('CONSTRUCTOR KEYS: ', constructorKeys);
      if (constructorKeys.length === 0) {
        this.createInstanceWithoutParams(klassKey, i, klassConstructor)
        // we are going to the next constructor
        // no needs to increase 'i' value as we decrease allKeys array
        continue
      }

      const instancesToInject = []
      for (const injectKey of constructorKeys) {
        const instanceToInject = this.instancesContainer.get(injectKey)

        if (!instanceToInject) {
          // we skip a constructor and wait for all instances appear
          // we should save it? in SET maybe? and remove it from set when it's found
          this.notFoundInjectKeys.add(injectKey)
          // think how to add other keys
          i++
          currentIterationNumber++
          continue outerLoop
        } else {
          this.notFoundInjectKeys.delete(injectKey)
          instancesToInject.push(instanceToInject)
        }
      }

      const createdKlass = new klassConstructor(...instancesToInject)
      this.instancesContainer.set(klassKey, createdKlass)
      this.removeKey(i)

      i++
      currentIterationNumber++
    }

    if (this.notFoundInjectKeys.size) {
      // @TODO found more keys! save it somehow
      throw new Error(
        `No injectable found for constructor keys: ${Array.from(
          this.notFoundInjectKeys,
        )
          .map((key) => `"${key}"`)
          .join(', ')}.`,
      )
    }
    return this.instancesContainer
  }
}

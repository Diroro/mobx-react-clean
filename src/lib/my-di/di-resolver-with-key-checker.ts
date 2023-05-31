import { INJECTABLE_TOKEN_KEY, INJECT_KEY } from './decorators'
import 'reflect-metadata'

type Klass<Interface = any> = new (...args: any[]) => Interface

const checkIfBrowser = () => (typeof globalThis.window === 'object');

export class DIResolverWithKeysChecker<
  DependencyInterface,
  Key extends string,
  T extends Record<Key, Klass<DependencyInterface>>
> {
  constructor(private readonly klasses: T) {}

  private allKeys: string[] = []
  private constructors: Map<string, Klass<DependencyInterface>> = new Map()
  private instancesContainer = new Map<string, DependencyInterface>()
  private notFoundInjectKeys = new Set<string>()

  private removeKey = (keyIndex: number) => {
    this.allKeys.splice(keyIndex, 1)
  }

  private addConstructorAndKeys = (key: string, klass: Klass<DependencyInterface>) => {
    // check the case when decorator is not added! may be throw an error
    const injectableKey = this.resolveInjectableKey(key, klass)
    this.constructors.set(injectableKey, klass)
    this.allKeys.push(injectableKey)
  }

  private resolveInjectableKey = (key: string, klass: Klass<DependencyInterface>) => {
    const injectableKey = Reflect.getMetadata(INJECTABLE_TOKEN_KEY, klass)
    if (injectableKey !== key) {
      throw new Error(
        `A key "${key}" provided to the class "${klass.name}" does not correspond to a key in @Inject decorator: "${injectableKey}".`,
      )
    }

    return injectableKey
  }

  private getConstructorKeys = (klassConstructor: Klass<DependencyInterface>): string[] => {
    const constructorKeys = Reflect.getOwnMetadataKeys(klassConstructor)
      .filter((item: string) => item.startsWith(INJECT_KEY))
      .map((token) => Reflect.getMetadata(token, klassConstructor))

	  if (!checkIfBrowser()) {
    	constructorKeys.reverse()
	}

    return constructorKeys
  }

  private createInstanceWithoutParams = (
    key: string,
    keyIndex: number,
    item: Klass<DependencyInterface>,
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

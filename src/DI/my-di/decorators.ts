import 'reflect-metadata'


export const INJECTABLE_TOKEN_KEY = 'injectableTokenKey'
export const INJECT_KEY = 'injectKey'

export const MakeInjectable = (token: string): ClassDecorator =>
  Reflect.metadata(INJECTABLE_TOKEN_KEY, token)

  
export const Inject = (token: string): ParameterDecorator => {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
	console.log('INJECT METADATA: ', target, parameterIndex, token);
    Reflect.defineMetadata(
      INJECT_KEY + parameterIndex,
      token,
      target,
      undefined as any,
    )
  }
}

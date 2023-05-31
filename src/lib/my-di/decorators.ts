import 'reflect-metadata';

export const INJECTABLE_TOKEN_KEY = 'injectableTokenKey';
export const INJECT_KEY = 'injectKey';

export const Injectable = (token: string): ClassDecorator =>
	Reflect.metadata(INJECTABLE_TOKEN_KEY, token);

export const Inject = (token: string): ParameterDecorator => {
	return (target: any) => {
		Reflect.defineMetadata(INJECT_KEY + token, token, target, undefined as any);
	};
};

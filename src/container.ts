import 'reflect-metadata'
import { Type } from './type'
import { isInjectable } from './injectable'
import { ClassProvider, FactoryProvider, InjectionToken, isClassProvider, isValueProvider, Provider, Token, ValueProvider } from './provider'
import { getInjectionToken } from './inject';

type InjectableParam = Type<any>;

const REFLECT_PARAMS_KEY = "design:paramtypes";


export class Container {
    private providers = new Map<Token<any>, Provider<any>>()

    addProvider<T>(provider: Provider<T>) {
        this.checkIfClassInjectable(provider);
        this.providers.set(provider.provide, provider)
    }

    inject<T>(type: Token<T>) {
        // TODO
        let provider = this.providers.get(type);
        if (provider === undefined && !(type instanceof InjectionToken)) {
            provider = { provide: type, useClass: type };
            this.checkIfClassInjectable(provider);
        }
        return this.processInjection<T>(type, provider);
    }

    private processInjection<T>(type: Token<T>, provider?: Provider<T>): T {
        if (provider === undefined || provider === null) {
            throw new Error(`Couldn't find a provider for type ${this.getTokenName(type)}`);
        }
        if (isClassProvider(provider)) {
            return this.injectClass(provider as ClassProvider<T>);
        }
        if (isValueProvider(provider)) {
            return this.injectValue(provider as ValueProvider<T>);
        }
        return this.injectFactory(provider as FactoryProvider<T>);
    }

    private checkIfClassInjectable<T>(provider: Provider<T>) {
        if (isClassProvider(provider) && !isInjectable(provider.useClass)) {
            throw new Error(
                `An error occurs providing ${this.getTokenName(provider.provide)}
                 for class ${this.getTokenName(provider.useClass)},
                 ${this.getTokenName(provider.useClass)} couldn't be injected`
            )
        }
    }

    private injectClass<T>(classProvider: ClassProvider<T>): T {
        const target = classProvider.useClass;
        const params = this.getInjectedParams(target);
        return Reflect.construct(target, params);
    }

    private injectValue<T>(valueProvider: ValueProvider<T>): T {
        return valueProvider.useValue;
    }

    private injectFactory<T>(valueProvider: FactoryProvider<T>): T {
        return valueProvider.useFactory();
    }

    private getInjectedParams<T>(target: Type<T>) {
        const argTypes = Reflect.getMetadata(REFLECT_PARAMS_KEY, target) as (
            | InjectableParam
            | undefined)[];
        if (argTypes === undefined) {
            return [];
        }
        return argTypes.map((argType, index) => {
            if (argType === undefined) {
                throw new Error(
                    `A recursive dependency has been detected in constructor for type ${target.name} at index ${index}`
                );
            }
            const overrideToken = getInjectionToken(target, index);
            const actualToken = overrideToken === undefined ? argType : overrideToken;
            let provider = this.providers.get(actualToken);
            return this.processInjection(actualToken, provider);
        });
    }


    private getTokenName<T>(token: Token<T>) {
        return token instanceof InjectionToken ? token.injectionIdentifier : token.name;
    }

}
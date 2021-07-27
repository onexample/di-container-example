import 'reflect-metadata'
import { isInjectable } from './injectable'
import { InjectionToken, isClassProvider, Provider, Token } from './provider'


export class Container {
    private providers = new Map<Token<any>, Provider<any>>()

    addProvider<T>(provider: Provider<T>) {
        this.checkIfClassInjectable(provider);
        this.providers.set(provider.provide, provider)
    }

    inject<T>(type: Token<T>) {
        // TODO
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

    private getTokenName<T>(token: Token<T>) {
        return token instanceof InjectionToken ? token.injectionIdentifier : token.name;
    }  

}
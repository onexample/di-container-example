import 'reflect-metadata'
import { Token } from './provider'

const INJECT_KEY = Symbol('INJECT_KEY');


export function Inject(token: Token<any>) {
    return function(target: any, _: string | symbol, index: number) {
        Reflect.defineMetadata(INJECT_KEY, token, target, `key-${index}`);
        return target;
    };
}
export function getInjectionToken(target: any, index: number) {
    return Reflect.getMetadata(INJECT_KEY, target, `key-${index}`) as Token<any> | undefined;
}
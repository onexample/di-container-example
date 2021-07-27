import 'reflect-metadata'
import { Type } from './type'

const INJECTABLE_KEY = Symbol("INJECTABLE_KEY");

export function Injectable() {

    return function (target: any) {
        Reflect.defineMetadata(INJECTABLE_KEY, true, target);
        return target
    }
}

export function isInjectable<T>(target: Type<T>) {
    return Reflect.getMetadata(INJECTABLE_KEY, target) === true;
}
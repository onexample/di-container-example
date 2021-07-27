import { Container } from "./container";
import { Injectable } from "./injectable";
import { Inject } from "./inject";
import { InjectionToken } from "./provider";


describe("Container", () => {

    class FooClass {
        constructor(public foo: string) { }
    }

    @Injectable()
    class BarClass {
        constructor(public foo: FooClass) { }
    }

    const SPECIAL_STRING_TOKEN = new InjectionToken("some-identifer");
    @Injectable()
    class ClassWithToken {
        constructor(@Inject(SPECIAL_STRING_TOKEN) public myCoolValue: string) { }
    }

    it('should resolve injections for value provider', () => {
        const container = new Container();
        const fooValue = { foo: "fooValue" }
        container.addProvider({ provide: FooClass, useValue: fooValue })
        const instance = container.inject(FooClass)
        expect(instance).toBe(fooValue);
    })


    it('should resolve injections for factory provider', () => {
        const container = new Container();
        const fooValue = { foo: "fooValue" }
        container.addProvider({ provide: FooClass, useFactory: () => fooValue })
        const instance = container.inject(FooClass)
        expect(instance).toBe(fooValue);
    })


    it('should resolve injections for class provider', () => {
        const container = new Container();
        const fooValue = { foo: "fooValue" }
        container.addProvider({ provide: FooClass, useFactory: () => fooValue })
        container.addProvider({ provide: BarClass, useClass: BarClass })
        const barInstance = container.inject(BarClass)
        expect(barInstance.foo).toBe(fooValue);
    })

    it('should resolve injection for token', () => {
        const container = new Container();
        const myCoolValue = "the special value";
        container.addProvider({ provide: ClassWithToken, useClass: ClassWithToken });
        container.addProvider({ provide: SPECIAL_STRING_TOKEN, useValue: myCoolValue });

        const output = container.inject(ClassWithToken);
        expect(output.myCoolValue).toEqual(myCoolValue);
    });


})
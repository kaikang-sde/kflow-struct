import { makeAutoObservable } from "mobx";

/**
 * Generate a global store instance(only one instance) which include reactive properties: token and details
 * @returns MobX Reactive Observable Object
 */
export function createStoreAuth() {
    // makeAutoObservable from mobx, it will make all properties reactive which means when property value changes, the UI will be re-rendered
    return makeAutoObservable(
        { // observable properties
            token: localStorage.getItem("token") ?? "",
            details: null
        }
    )
}
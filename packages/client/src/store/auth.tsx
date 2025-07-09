import { makeAutoObservable } from "mobx";

/**
 * Factory function to create a store
 * @returns observable store instance
 */
export function createStoreAuth() {
    // Create an Reactive Observable Object: whenever property value changes, the UI will be re-rendered
    return makeAutoObservable(
        { // observable properties
            token: localStorage.getItem("token") ?? "",
            details: null
        }
    )
}
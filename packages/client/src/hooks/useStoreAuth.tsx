import { createStoreAuth } from "../store/auth";
import { computed } from "mobx";

// create observable store instance
const storeAuth = createStoreAuth();

// expose a custom hook to access login status
export function useStoreAuth() {
    // check if logged in, computed property will be re-evaluated when storeAuth.token changes
    const isLogin = computed(() => !!storeAuth.token);

    return { isLogin };
}


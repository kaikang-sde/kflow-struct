import { createStoreAuth } from "../store/auth";
import { action, computed } from "mobx";
import { useNavigate } from "react-router-dom";

// create a global store instance(only one instance, singleton) which include reactive properties: token and details
// export it for other components to use so that they can react to token changes
export const storeAuth = createStoreAuth();

// expose a custom hook to access login status
export function useStoreAuth() {
    const nav = useNavigate();
    // isLogin is a computed property from mobx, it will be re-evaluated when storeAuth.token changes
    // if storeAuth.token is not empty, isLogin will be true, otherwise false
    // computed means it will be re-evaluated when any of its dependencies change which is storeAuth.token in this case
    const isLogin = computed(() => !!storeAuth.token);

    // login is a action from mobx, it will be re-evaluated when storeAuth.token changes
    // action means it will be re-evaluated when any of its dependencies change which is storeAuth.token in this case
    const login = action(async (token: string) => {
        storeAuth.token = token;
        localStorage.setItem("token", token);

        nav("/edit");
    })

    return { isLogin, login };
}


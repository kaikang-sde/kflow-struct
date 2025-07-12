import { createStoreAuth } from "../store/auth";
import { action, computed } from "mobx";
import { useNavigate } from "react-router-dom";

// create observable store instance
export const storeAuth = createStoreAuth();



// expose a custom hook to access login status
export function useStoreAuth() {
    const nav = useNavigate();
    // check if logged in, computed property will be re-evaluated when storeAuth.token changes
    const isLogin = computed(() => !!storeAuth.token);
    

    // login
    const login = action(async (token: string) => {
        storeAuth.token = token;
        localStorage.setItem("token", token);

        nav("/edit");
    })

    return { isLogin, login };
}


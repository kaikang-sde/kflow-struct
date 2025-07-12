import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStoreAuth } from "../hooks";

function Home() {
    const nav = useNavigate();
    const location = useLocation();
    const { isLogin } = useStoreAuth();

    function beforceRouterChange(pathname: string) {
        if (isLogin.get()) {
            // if logged in, when in root or login register pages, need to redirect to edit page
            ["/", "/login-register"].includes(pathname) && nav("/edit");
        } else {
            // if not logged in, when in edit page, need to redirect to login register page
            pathname !== "/login-register" && nav("/login-register");
        }
    }

    // listen to location/pathname changem and redirect to appropriate page
    useEffect(() => {
        beforceRouterChange(location.pathname);
    }, [location.pathname])

    return <Outlet />; 
}


export default Home;
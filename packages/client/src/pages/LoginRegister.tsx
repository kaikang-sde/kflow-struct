import { useState } from "react";
import Register from "../components/Register";
import Login from "../components/Login";

export default function LoginRegister() {
    // default true: register component, false: login component
    const [loginOrRegister, setLoginOrRegister] = useState(true);
    // click register/login button to switch component
    const changeState = () => {
        setLoginOrRegister(!loginOrRegister);
    };

    return (
        <div className="h-full bg-[url('/bg.png')] bg-repeat bg-contain bg-center">
            {loginOrRegister ? (
                <Register changeState={changeState}></Register>
            ) : (
                <Login changeState={changeState}></Login>
            )}
        </div>
    );
}
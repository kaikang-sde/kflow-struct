import { createHashRouter } from "react-router-dom";
import Home from "../pages";
import LoginRegister from "../pages/LoginRegister";
import Edit from "../pages/Edit";


export const router = createHashRouter(
    [
        {
            path: '/',
            element: <Home />,
            children: [
                {
                    path: '/login-register',
                    element: <LoginRegister />
                },
                {
                    path: '/edit',
                    element: <Edit />
                }
            ]
        }
    ]
)
import { createHashRouter } from "react-router-dom";
import Home from "../pages";
import LoginRegister from "../pages/LoginRegister";
import PageEditor from "../pages/PageEditor";


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
                    path: '/page-editor',
                    element: <PageEditor />
                }
            ]
        }
    ]
)
//Importaciones
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage.jsx";
import RootLayout from "../layout/RootLayout.jsx"
import { ROUTES } from "./paths.js"
import Home from "../pages/HomePage.jsx";
import Login from "../pages/LoginPage.jsx";



export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: ROUTES.HOME,
                element: <Home />
            },
            {
                path: ROUTES.LOGIN,
                element: <Login />
            }
        ]
    }
]);
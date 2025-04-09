import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import RootLayout from "../layout/RootLayout";
import { ROUTES } from "./paths";
import Home from "../pages/HomePage";
import Login from "../pages/LoginPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.HOME,
        element: <Home />,
      },
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
    ],
  },
]);
import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import RootLayout from "../layout/RootLayout";
import { ROUTES } from "./paths";
import SellerPage from "../pages/SellerPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import PropertyPage from "../pages/PropertyPage";
import VisitPage from "../pages/VisitPage";
import PrivateRoute from "../components/PrivateRoute"; // Importa el PrivateRoute

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <Navigate to={ROUTES.ERROR} replace />,
    children: [
      {
        path: ROUTES.ERROR,
        element: <ErrorPage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },   
      {
        path: ROUTES.HOME,
        element: (
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.SELLER,
        element: (
          <PrivateRoute>
            <SellerPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.PROPERTY,
        element: (
          <PrivateRoute>
            <PropertyPage />
          </PrivateRoute>
        ),
      },
      {
        path: ROUTES.VISIT,
        element: (
          <PrivateRoute>
            <VisitPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

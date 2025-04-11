import { Routes, Route} from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import { ROUTES } from "./paths";
import SellerPage from "../pages/SellerPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import PropertyPage from "../pages/PropertyPage";
import VisitPage from "../pages/VisitPage";
import PrivateLayout from "../layout/PrivateLayout";
import NewSellerPage from "../pages/NewSellerPage";
import ErrorPage from "../pages/ErrorPage";
import NewPropertyPage from "../pages/NewPropertyPage";

const RouterLayout = () => {
  return (
    <Routes>

      <Route element={<RootLayout />}>

        <Route element={<PrivateLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SELLER}>
            <Route index element={<SellerPage />} />
            <Route path={ROUTES.NEWSELLER} element={<NewSellerPage />} />
          </Route>
          <Route path={ROUTES.PROPERTY}>
            <Route index element={<PropertyPage />} />
            <Route path={ROUTES.NEWPROPERTY} element={<NewPropertyPage />} />
          </Route>
          <Route path={ROUTES.VISIT} element={<VisitPage />} />

          <Route path="*" element={<ErrorPage />} />
        </Route>

        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      </Route>

    </Routes>
  );
};

export default RouterLayout;

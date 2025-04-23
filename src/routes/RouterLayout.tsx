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
import SellerDetailsPage from "../pages/SellerDetailsPage";
import PropertyDetailsPage from "../pages/PropertyDetailsPage";
import NewVisitPage from "../pages/NewVisitPage";
import VisitDetailsPage from "../pages/VisitDetailsPage";

const RouterLayout = () => {
  return (
    <Routes>

      <Route element={<RootLayout />}>

        <Route element={<PrivateLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SELLER}>
            <Route index element={<SellerPage />} />
            <Route path={ROUTES.SELLERDETAILS} element={<SellerDetailsPage />} />
            <Route path={ROUTES.NEWSELLER} element={<NewSellerPage />} />
          </Route>
          <Route path={ROUTES.PROPERTY}>
            <Route index element={<PropertyPage />} />
            <Route path={ROUTES.PROPERTYDETAILS} element={<PropertyDetailsPage />} />
            <Route path={ROUTES.NEWPROPERTY} element={<NewPropertyPage />} />
          </Route>
          <Route path={ROUTES.VISIT}>
            <Route index element={<VisitPage />} />
            <Route path={ROUTES.NEWVISIT} element={<NewVisitPage />} />
            <Route path={ROUTES.VISITDETAILS} element={<VisitDetailsPage />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Route>

        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      </Route>

    </Routes>
  );
};

export default RouterLayout;

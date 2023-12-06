import "./App.scss";
import SlideBar from "./System/Sidebar/Sidebar";
import AppRoutes from "../routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rings } from "react-loader-spinner";
import { UserContext } from "../context/userContext";
import { useContext } from "react";

function App() {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && user.isLoading ? (
        <div className="loading-container">
          <Rings heigth="100" width="100" color="#1877f2" ariaLabel="loading" />
          <div>Loading data...</div>
        </div>
      ) : (
        <div className="app">
          <div className="app-slidebar">
            <SlideBar />
          </div>
          <div className="content">
            <AppRoutes />
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
<>
  {/* <Switch>
            <Route path="/" exact component={UserDashboard} />
            <Route
              path="/admin"
              render={() =>
                isAuthenticated() && isAdmin() ? (
                  <AdminDashboard />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route
              path="/store-owner"
              render={() =>
                isAuthenticated() && isStoreOwner() ? (
                  <StoreOwnerDashboard />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route
              path="/shipper"
              render={() =>
                isAuthenticated() && isShipper() ? (
                  <ShipperDashboard />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route path="*" component={NotFound} />
          </Switch> */}
</>;

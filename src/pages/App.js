import "./App.scss";
import SlideBar from "./System/Sidebar/Sidebar";
import AdminDashboard from "../routes/System";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <div className="app">
        <div className="app-slidebar">
          <SlideBar />
        </div>
        <div className="content">
          <AdminDashboard />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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

import "./App.scss";
import SlideBar from "./System/Sidebar/Sidebar";
import AdminDashboard from "../routes/System";

function App() {
  return (
    <div className="app">
      <div className="app-slidebar">
        <SlideBar />
      </div>
      <div className="content">
        <AdminDashboard />
      </div>
    </div>
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

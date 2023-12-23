import "./App.scss";
import SlideBar from "./System/Sidebar/Sidebar";
import AppRoutes from "../routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rings } from "react-loader-spinner";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import ClinetRoutes from "../routes/ClinetRoutes";

function App() {
  const { user } = useContext(UserContext);

  let contentClass = "app-routes";
  let appClass = "null";

  if (
    user &&
    user.account &&
    user.account.groupWithRoles &&
    user.account.groupWithRoles.id &&
    user.account.groupWithRoles.id === 4
  ) {
    contentClass = "client-routes";
  }

  if (
    user &&
    user.account &&
    user.account.groupWithRoles &&
    user.account.groupWithRoles.id &&
    [1, 2, 3].includes(user.account.groupWithRoles.id)
  ) {
    appClass = "app";
  }
  return (
    <>
      {user && user.isLoading ? (
        <div className="loading-container">
          <Rings heigth="100" width="100" color="#1877f2" ariaLabel="loading" />
          <div>Loading data...</div>
        </div>
      ) : (
        <div className={appClass}>
          <div className="app-slidebar">
            {user &&
              user.account &&
              user.account.groupWithRoles &&
              user.account.groupWithRoles.id &&
              [1, 2, 3].includes(user.account.groupWithRoles.id) && (
                <SlideBar />
              )}
          </div>
          <div className={contentClass}>
            {user &&
            user.account &&
            user.account.groupWithRoles &&
            user.account.groupWithRoles.id &&
            user.account.groupWithRoles.id === 4 ? (
              <ClinetRoutes />
            ) : (
              <AppRoutes />
            )}
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

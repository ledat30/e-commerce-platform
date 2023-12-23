import "./HomePage.scss";
import "./base.scss";
import "./grid.scss";
import "./responsive.scss";
import HeaderHome from "./HeaderHome/HeaderHome";
import MainHomePage from "./MainHomePage/MainHomePage";
import Footer from "./Footer/Footer";

function HomePage() {
  return (
    <>
      <HeaderHome />
      <MainHomePage />
      <Footer />
    </>
  );
}

export default HomePage;

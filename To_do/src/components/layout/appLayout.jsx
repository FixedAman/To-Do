import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import MainSidebar from "./MainSidebar";

// working on comment fixing sidebar

const AppLayout = () => {
  return (
    <>
      {/*Header*/}

      <Header />

      {/* main content*/}
      <MainSidebar />
      <Outlet />

      {/* footer */}

      <Footer />
    </>
  );
};
export default AppLayout;

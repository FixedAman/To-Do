import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";

const AppLayout = () => {
  return (
    <>
      <div className="container">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};
export default AppLayout;

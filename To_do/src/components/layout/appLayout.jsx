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
      <MainSidebar />

      {/* main content*/}
      <main className="md:pl-64">
        <Outlet />
      </main>

      {/* footer */}

      <Footer />
    </>
  );
};
export default AppLayout;

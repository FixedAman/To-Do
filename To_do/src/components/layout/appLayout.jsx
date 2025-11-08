import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import { Layout } from "antd";
import Logo from "../ui/Logo";
// working on comment fixing sidebar
const { Header: AntHeader, Sider, Content, Footer: AntFooter } = Layout;
const AppLayout = () => {
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          className="sidebar
        "
        >
          <h1 className=" bg-white ">Siderbar</h1>
        </Sider>

        <Layout>
          {/*Header*/}
          <AntHeader className="p-4 bg-white shadow">
            <Header />
          </AntHeader>
          {/* main content*/}
          <Content className="p-4">
            <Outlet />
          </Content>
          {/* footer */}
          <AntFooter className="bg-gray-900 text-white text-center">
            <Footer />
          </AntFooter>
        </Layout>
      </Layout>
    </>
  );
};
export default AppLayout;

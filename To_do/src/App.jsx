import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/appLayout";
import { ToastContainer } from "react-toastify";
import About from "./pages/about";
import Home from "./pages/home";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about-us",
          element: <About />,
        },
      ],
      errorElement: <Error />,
    },
  ]);
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};
export default App;

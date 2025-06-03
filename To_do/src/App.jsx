import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/appLayout";
import Home from "./pages/Home";
import About from "./pages/about";

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
      <RouterProvider router={router} />
    </>
  );
};
export default App;

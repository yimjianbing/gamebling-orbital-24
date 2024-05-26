import { Protected } from "../auth/Protected";
import About from "../components/About/About";
import ContactUs from "../components/ContactUs/ContactUs";
import LoginRegister from "../components/LoginRegister/LoginRegister";
import Layout from "../components/NavBar/Layout";
import { MainMenu } from "../components/MainMenu/MainMenu";

const RouterBuilder = () => {
  const generalRoutes = [
    {
      path: "/loginregister",
      element: <LoginRegister />,
    },
    {
      path: "/",
      element: <></>,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/contactus",
      element: <ContactUs />,
    },
    {
      path: "/mainmenu",
      element: (
        <Protected>
          <MainMenu />
        </Protected>
      ),
    },
  ];

  const routes = [
    {
      element: <Layout />,
      children: generalRoutes,
    },
  ];

  return routes;
};

export default RouterBuilder;

import { Protected } from "../auth/Protected";
import About from "../pages/About/About";
import ContactUs from "../pages/ContactUs/ContactUs";
import LoginRegister from "../pages/LoginRegister/LoginRegister";
import Layout from "../components/NavBar/Layout";
import { MainMenu } from "../pages/MainMenu/MainMenu";
import Poker from "../gameLogic/poker/Poker"; 


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
    {
      path: "/poker",
      element: (
        <Protected>
          <Poker />
        </Protected>
      )
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

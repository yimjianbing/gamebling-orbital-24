import Layout from "../Components/NavBar/Layout";
import { Protected } from "../auth/Protected";
import { InGameProvider } from "../context/InGameContext";
import Poker from "../gameLogic/poker/poker";
import About from "../pages/About/About";
import ContactUs from "../pages/ContactUs/ContactUs";
import LoginRegister from "../pages/LoginRegister/LoginRegister";
import Layout from "../components/NavBar/Layout";
import { MainMenu } from "../pages/MainMenu/MainMenu";
// import { InGameProvider } from "../context/InGameContext";

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
      element: <Poker />,
    },
  ];

  const routes = [
    {
      element: <InGameProvider><Layout /></InGameProvider>,
      children: generalRoutes,
    },
  ];

  return routes;
};

export default RouterBuilder;

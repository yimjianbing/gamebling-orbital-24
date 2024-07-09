//import Layout from "../Components/NavBar/Layout";
import { Protected } from "../auth/Protected";
import { InGameProvider } from "../context/InGameContext";
import Poker from "../gameLogic/poker/poker";
import About from "../pages/About/About";
import ContactUs from "../pages/ContactUs/ContactUs";
import LoginRegister from "../pages/LoginRegister/LoginRegister";
import Layout from "../Components/NavBar/Layout";
import { MainMenu } from "../pages/MainMenu/MainMenu";
import OnlinePoker from "../onlineGameLogic/onlinePoker/OnlinePoker";
import { PokerMenu } from "../pages/PokerMenu/PokerMenu";
import { Skins } from "../pages/Skins/Skins";

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
    {
      path: "/onlinepoker",
      element: <OnlinePoker />,
    },
    {
      path: "/pokermenu",
      element: <PokerMenu />,
    },
    {
      path: "/skins",
      element: <Skins />,
    }
  ];

  const routes = [
    {
      element: (
        <InGameProvider>
          <Layout />
        </InGameProvider>
      ),
      children: generalRoutes,
    },
  ];

  return routes;
};

export default RouterBuilder;

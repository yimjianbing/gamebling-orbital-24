//import Layout from "../Components/NavBar/Layout";
import { Protected } from "../auth/Protected";
import { InGameProvider } from "../context/InGameContext";
import { TutorialProvider } from "../context/TutorialContext";
import Poker from "../gameLogic/poker/poker";
import About from "../pages/About/About";
import ContactUs from "../pages/ContactUs/ContactUs";
import LoginRegister from "../pages/LoginRegister/LoginRegister";
import Layout from "../components/NavBar/Layout";
import { MainMenu } from "../pages/MainMenu/MainMenu";
import OnlinePoker from "../onlineGameLogic/onlinePoker/OnlinePoker";
import { PokerMenu } from "../pages/PokerMenu/PokerMenu";
import { Skins } from "../pages/Skins/Skins";
import  Tutorial  from "../tutorialLogic/poker/Tutorial";


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
      path: "/tutorial",
      element: (<TutorialProvider>
        <Tutorial />
        </TutorialProvider>),
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
      element: (<TutorialProvider>
        <PokerMenu />
        </TutorialProvider>),
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

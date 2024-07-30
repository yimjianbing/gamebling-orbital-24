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
import Tutorial  from "../tutorialLogic/poker/Tutorial";
import Rules from "../tutorialLogic/poker/Rules";
import { TutorialMenu } from "../pages/TutorialMenu/TutorialMenu";
import { Friends } from "../pages/Friends/Friends";
import  Profile  from "../pages/Profile/Profile";
import { Achievements } from "../pages/Achievements/Achievements";
import path from "path-browserify";


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
    },
    {
      path: "/rules",
      element: <Rules />,
    },
    {
      path: "/tutorialMenu",
      element: (<TutorialProvider>
        <TutorialMenu />
        </TutorialProvider>),
    },
    {
      path: "/friends",
      element: <Friends />,
    }, {
      path: "profile/:id",
      element: <Profile/>,
    }, {
      path: "/achievements",
      element: <Achievements />,
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

import { Protected } from '../../auth/Protected';
import About from '../About/About';
import ContactUs from '../ContactUs/ContactUs';
import LoginRegister from '../LoginRegister/LoginRegister';
import Layout from './Layout'
import {MainMenu} from '../MainMenu/MainMenu';

const RouterBuilder = () => {
  const generalRoutes = [
    {
        path: '/loginregister',
        element: <LoginRegister />,
    },
    {
        path: '/',
        element: <></>
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/contactus',
        element: <ContactUs />
    },
    {
        path: "/mainmenu",
        element: <Protected><MainMenu /></Protected>
    }
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
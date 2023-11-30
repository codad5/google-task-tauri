import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider,extendTheme, type ThemeConfig  } from '@chakra-ui/react';
import { RecoilRoot } from "recoil";
import PrivacyPolicy from "./pages/privacy-policy";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TermOfService from "./pages/term-of-service";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/tos",
    element: <TermOfService />,
  },
]);

// use dark mode by default or based on system preferences
const config : ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
}
const theme = extendTheme({ config })
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <RecoilRoot>
      <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
      </ChakraProvider>
    </RecoilRoot>
);

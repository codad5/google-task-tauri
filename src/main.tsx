import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider,extendTheme, type ThemeConfig  } from '@chakra-ui/react';
import { RecoilRoot } from "recoil";

// use dark mode by default or based on system preferences
const config : ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}
const theme = extendTheme({ config })
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <RecoilRoot>
      <ChakraProvider theme={theme}>
          <App />
      </ChakraProvider>
    </RecoilRoot>
);

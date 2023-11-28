import {invoke} from "@tauri-apps/api/tauri";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider,extendTheme, type ThemeConfig  } from '@chakra-ui/react';
import { RecoilRoot } from "recoil";


invoke('test_command').then((res) => {
  console.log(res);
});

// use dark mode by default or based on system preferences
const config : ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
}
const theme = extendTheme({ config })
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <RecoilRoot>
      <ChakraProvider theme={theme}>
          <App />
      </ChakraProvider>
    </RecoilRoot>
);

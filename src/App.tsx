import { useState , useEffect} from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Avatar, Box, Button, Spinner, Wrap, WrapItem, useColorMode, Popover , PopoverTrigger, Portal, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader  } from '@chakra-ui/react'
import TaskPage from "./components/TaskPage";
import { listen } from "@tauri-apps/api/event";
import { shell } from "@tauri-apps/api";
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

const GOOGLE_TASK_ENDPOINT = "https://tasks.googleapis.com/tasks/v1";
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPE = "https://www.googleapis.com/auth/tasks";
function getLocalHostUrl(port: number) {
  return `http://localhost:${port}`;
}


function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { colorMode, toggleColorMode } = useColorMode()
  const [oauthPort, setOauthPort] = useState<number | null>(null)
  const [code, setCode] = useState<string | null>(null)
  
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    // setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    console.log("useEffect");
    if (code) {
      writeTextFile('code.txt', code, { dir: BaseDirectory.AppLocalData }).then(() => {
        console.log('code.txt saved');
        setLoggedIn(code ? true : false)
      });
    }
  }, [code])

  useEffect(() => {
    console.log("useEffect");

    let _port: number | null = null;
    invoke("plugin:oauth|start").then(async (port) => {
      console.log(port, "port");
      setOauthPort(port as number);
      _port = port as number;
    });

    const unlisten = listen("oauth://url", (data) => {
      console.log(data, "data");
      setOauthPort(null);
      if (!data.payload) return;
      const url = new URL(data.payload as string);
      const code = new URLSearchParams(url.search).get("code");
      console.log(code);
      if (code) {
        console.log(code);
        setCode(code)
      }
    });

    
    
  }, []);



  async function handleLogin() {
    setLoading(true)
    // create and set a new URL object with the endpoint and query parameters
    const url = new URL(GOOGLE_OAUTH_ENDPOINT);
    url.searchParams.append("client_id", "394505623537-n78mpn7rpc18csp74h07mjufbjhihean.apps.googleusercontent.com");
    url.searchParams.append("redirect_uri", getLocalHostUrl(oauthPort as number));
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", SCOPE);
    url.searchParams.append("include_granted_scopes", "true");
    url.searchParams.append("state", "state_parameter_passthrough_value");
    // open the URL in the default browser
    console.log(getLocalHostUrl(oauthPort as number));
    shell.open(url.href);
    // if (true) {
    //   setLoggedIn(true)
    // }
    // setLoading(false)
  }

  async function handleLogout() {
    setLoading(true)
    if (true) {
      setLoggedIn(false)
    }
    setLoading(false)
  }

  return (
    <div className="">
      <Box p={4} maxW='3xl' mx='auto' h='100vh'>
        <Box textAlign='center' mb={4}>
          <h1>Google Tasks Desktop</h1>
        </Box>
        <Box textAlign='right'>
            <Wrap spacing="30px" justify="flex-end">
            <WrapItem>
                {
                loggedIn ?
                  (
                    <Popover>
                      <PopoverTrigger>
                        <Avatar size="sm" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
                      </PopoverTrigger>
                      <Portal> 
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverHeader>Howdy 👋</PopoverHeader>
                          <PopoverCloseButton />
                          <PopoverBody>
                            <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
                          </PopoverBody>
                          <PopoverFooter> Date {new Date().getFullYear()}</PopoverFooter>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  ) :
                  <Button onClick={() => setLoggedIn(true)}>Signin</Button>
                }
            </WrapItem>
            <WrapItem>
                    <Button onClick={toggleColorMode}>
                        Toggle {colorMode === "light" ? "Dark" : "Light"}
                    </Button>
                </WrapItem>
            </Wrap>
        </Box>
        {loggedIn ? <TaskPage /> :
          (
            <Box textAlign='center' mt={8} mb={8} h='60%' display='flex' alignItems='center' justifyContent='center'>
              {
              loading ?
                <Spinner size='xl' /> : 
                <Button onClick={handleLogin}>Signin with Google</Button>
              }
            </Box>
          )
        }
        <Box textAlign='center' mt={8} mb={8}>
          <a href="https://codad5.dev" target="_blank" rel="noreferrer">
            codad5
          </a>
          <span> © {new Date().getFullYear()}</span>
          <span> - </span>
        </Box>
      </Box>
    </div>
  );
}

export default App;

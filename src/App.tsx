import { useState , useEffect} from "react";
import { Avatar, Box, Button, Spinner, Wrap, WrapItem, useColorMode, Popover, useToast  , PopoverTrigger, Portal, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader  } from '@chakra-ui/react'
import TaskPage from "./components/TaskPageOld";
import { listen } from "@tauri-apps/api/event";
import { fetchUserProfile,getUserProfileFromStorage,  getAccessToken, openAuthWindow, saveAccessToken, saveAuthCode, saveUserProfile, getAccessTokenFromStorage, deleteAccessToken } from "./helpers/auth";
import { AccessToken, UserProfile } from "./types/googleapis";
import { disableMenu, pushNotification } from "./helpers/windowhelper";
import TaskPage2 from "./components/TaskPage";

// disable default context menu on build
disableMenu();


pushNotification({
  title: 'Hello World',
  body: 'This is a notification from Tauri!',
  icon: 'https://tauri.studio/favicon.ico'
})

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { colorMode, toggleColorMode } = useColorMode()
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // error message toast
  const toast = useToast()


  // to generate a port and listen to it
  useEffect(() => {
    listen("oauth://url", async (data) => {
      try {
        console.log(data, "data");
        if (!data.payload) return;
        const url = new URL(data.payload as string);
        const code = new URLSearchParams(url.search).get("code");
        console.log(code);
        if (code) {
          saveAuthCode(code).then(() => {
            console.log("code saved");
          });
          const accessTokenBody = await getAccessToken(code);
          console.log(accessTokenBody);
          await handleLoadFrom(accessTokenBody);
        }
      } catch (err) {
        console.log("error", err);
        setLoading(false)
        toast({
          title: "Error",
          description: "Error signing in",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      }
    });
  }, []);

  // check the offline data for access token
  useEffect(() => {
    getAccessTokenFromStorage().then((accessToken) => {
      if (accessToken) {
        if (navigator.onLine) {
          fetchUserProfile(accessToken.access_token).then((profile) => {
          if (profile) {
            setProfile(profile);
            setAccessToken(accessToken.access_token);
            setLoggedIn(true);
          }
        });
        }
        else {
          getUserProfileFromStorage().then((profile) => {
          if (profile) {
            setProfile(profile);
            setAccessToken(accessToken.access_token);
            setLoggedIn(true);
          }
          });
        }
      }
    });
  }, [])



  async function handleLoadFrom(accessTokenBody: AccessToken) {
    try {
      saveAccessToken(JSON.stringify(accessTokenBody)).then(() => {
        console.log("access token saved");
      });
      setAccessToken(accessTokenBody.access_token);
      const userProfile = await fetchUserProfile(accessTokenBody.access_token);
      saveUserProfile(userProfile).then(() => {
        console.log("user profile saved");
      });
      console.log(userProfile);
      setProfile(userProfile);
      setLoggedIn(true);
    }
    catch (err) {
      console.log(err);
      setLoading(false)
      await handleLogout();
      toast({
        title: "Error",
        description: "Error signing in",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  }
 

  async function handleLogout() {
    setLoading(true)
    setAccessToken(null);
    setProfile(null);
    setLoggedIn(false);
    await deleteAccessToken();
    setLoading(false)
  }

  async function handleLogin() {
    setLoading(true)
    try {
      const storedAccessToken = await getAccessTokenFromStorage();
      if (storedAccessToken) {
        handleLoadFrom(storedAccessToken);
        return;
      }
      await openAuthWindow();
    } catch (error) {
      console.log(error);
      setLoading(false)
      await handleLogout();
      toast({
        title: "Error",
        description: "Error signing in",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
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
                        <Avatar size="sm" name={profile?.name ?? "default"} src={profile?.picture ?? ""} />
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
                  <Button onClick={handleLogin}>Signin</Button>
                }
            </WrapItem>
            <WrapItem>
                    <Button onClick={toggleColorMode}>
                        Toggle {colorMode === "light" ? "Dark" : "Light"}
                    </Button>
                </WrapItem>
            </Wrap>
        </Box>
        {loggedIn ? <TaskPage2 access_token={accessToken ?? undefined} /> :
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
          <a href="https://codad5.me" target="_blank" rel="noreferrer">
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

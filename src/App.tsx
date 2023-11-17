import { useState , useEffect} from "react";
import { Box, Button, Spinner, useToast  } from '@chakra-ui/react'
import { listen } from "@tauri-apps/api/event";
import { fetchUserProfile,getUserProfileFromStorage,  getAccessToken, openAuthWindow, saveAccessToken, saveAuthCode, saveUserProfile, getAccessTokenFromStorage, deleteAccessToken } from "./helpers/auth";
import { AccessToken, UserProfile } from "./types/googleapis";
import { disableMenu, pushNotification } from "./helpers/windowhelper";
import TaskPage from "./components/TaskPage";

import { useRecoilState, useSetRecoilState } from "recoil";
import { accessTokenState, attemptLoginState, attemptLogoutState, loggedInState, userProfileState } from "./config/states";
import Header from "./components/ui/Header";

// disable default context menu on build
disableMenu();


pushNotification({
  title: 'Hello World',
  body: 'This is a notification from Tauri!',
  icon: 'https://tauri.studio/favicon.ico'
})

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useRecoilState<boolean>(loggedInState);
  const setProfile = useSetRecoilState<UserProfile | null>(userProfileState);
  const setAccessToken = useSetRecoilState<string | null>(accessTokenState);
  const [attemptedLogin, setAttemptedLogin] = useRecoilState<boolean>(attemptLoginState);
  const [attemptedLogout, _setAttemptedLogout] = useRecoilState<boolean>(attemptLogoutState);
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
        pushNotification("Login Successful")
        if (navigator.onLine) {
          fetchUserProfile(accessToken.access_token).then((profile) => {
            if (profile) {
              setProfile(profile);
              setAccessToken(accessToken.access_token);
              setLoggedIn(true);
              pushNotification(`welcome back ${profile.name}`)
            }
          });
        }
        else {
          getUserProfileFromStorage().then((profile) => {
          if (profile) {
            setProfile(profile);
            setAccessToken(accessToken.access_token);
            setLoggedIn(true);
            pushNotification(`welcome back ${profile.name}`)
          }
          });
        }
      }
    });
  }, [])



  async function handleLoadFrom(accessTokenBody: AccessToken) {
    try {
      saveAccessToken(JSON.stringify(accessTokenBody, null, 2)).then(() => {
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

  useEffect(() => {
    if (attemptedLogin) handleLogin();
    
  }, [attemptedLogin])

  useEffect(() => {
    if (attemptedLogout) handleLogout();
  }, [attemptedLogout])

  

  async function handleLogin() {
    setLoading(true)
    try {
      const storedAccessToken = await getAccessTokenFromStorage();
      if (storedAccessToken) {
        handleLoadFrom(storedAccessToken);
        pushNotification('Login Successful')
        return;
      }
      pushNotification('login required')
      await openAuthWindow();
    } catch (error) {
      console.log(error);
      setLoading(false)
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
        <Header />
        {loggedIn ? <TaskPage  /> :
          (
            <Box textAlign='center' mt={8} mb={8} h='60%' display='flex' alignItems='center' justifyContent='center'>
              {
              loading ?
                <Spinner size='xl' /> : 
                <Button onClick={() => setAttemptedLogin(true)}>Signin with Google</Button>
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

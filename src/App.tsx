import { useState , useEffect} from "react";
import { Box, Button, Spinner, useToast  } from '@chakra-ui/react'
import { fetchUserProfile,getUserProfileFromStorage,  getAccessToken, openAuthWindow, saveAccessToken, saveAuthCode, saveUserProfile, getAccessTokenFromStorage, deleteAccessToken } from "./helpers/auth";
import { AccessToken, UserProfile } from "./types/googleapis";
import { loadContextmenu , pushNotification } from "./helpers/windowhelper";
import TaskPage from "./components/TaskPage";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { accessTokenState, activeCategoryTasksState, activeTaskCategoryState, attemptLoginState, attemptLogoutState, loggedInSelector, messageState, userProfileState } from "./config/states";
import Header from "./components/ui/Header";
import { task } from "./types/taskapi";
import { listen_for_auth_code } from "./helpers/eventlistner";

// disable default context menu on build
loadContextmenu();

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const loggedIn = useRecoilValue(loggedInSelector);
  const setProfile = useSetRecoilState<UserProfile | null>(userProfileState);
  const setAccessToken = useSetRecoilState<string | null>(accessTokenState);
  const [attemptedLogin, setAttemptedLogin] = useRecoilState<boolean>(attemptLoginState);
  const [attemptedLogout, setAttemptedLogout] = useRecoilState<boolean>(attemptLogoutState);
  const setActiveTaskCategory = useSetRecoilState<number>(activeTaskCategoryState);
  const setActiveCategoryTasksState = useSetRecoilState<task[]>(activeCategoryTasksState);
  const [toastMessage, setToastMessage] = useRecoilState(messageState)

  // error message toast
  const toast = useToast()


  useEffect(() => {
    if (toastMessage) {
      toast({
        title: toastMessage.title,
        description: toastMessage.body,
        status: toastMessage.type,
        duration: 9000,
        isClosable: true,
      })
      setTimeout(() => {
        setToastMessage(null)
      }, 5000)
    }
  }, [toastMessage])


  

  // to generate a port and listen to it
  useEffect(() => {
    listen_for_auth_code({
      onSucess: (code) => {
        console.log(code, "code generated");
        if (code) {
          saveAuthCode(code).then(() => {
            console.log("code saved");
          });
          getAccessToken(code).then((accessTokenBody) => {
            handleLoadFrom(accessTokenBody)
          });
        }
      }, 
      onError: (err) => {
        console.log(err);
        setLoading(false)
        setToastMessage({
          title: "Error",
          body: "Error signing in",
          type: "error"
        })
      }
    });
  }, []);
  

  // check the offline data for access token
  useEffect(() => {
    setLoading(true)
    // get access token from storage
    getAccessTokenFromStorage().then((accessToken) => {
      try {
        if (!accessToken) throw new Error("Signin required");
          pushNotification("Login Successful")
          if (navigator.onLine) {
            // fetch user profile
            fetchUserProfile(accessToken.access_token).then((profile) => {
              if(!profile) throw new Error("Something went wrong, please try again");
              setProfile(profile);
              setAccessToken(accessToken.access_token);
              setLoading(false)
              pushNotification(`welcome back ${profile.name}`)
            });
          }
          else {
            getUserProfileFromStorage().then((profile) => {
              if (!profile) throw new Error("Signin required");
                setProfile(profile);
                setAccessToken(accessToken.access_token);
                pushNotification(`welcome back ${profile.name}`)
            });
          }
      }catch (err) {
          console.log(err);
          setLoading(false)
          setToastMessage({
            title: "Error",
            body: "Error signing in",
            type: "error"
          })
        }
    }).finally(() => {
      setLoading(false)
    })
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
    }
    catch (err) {
      console.log(err);
      setLoading(false)
      await handleLogout();
      setToastMessage({
        title: "Error",
        body: "Error signing in",
        type: "error"
      })
    }
  }
 

  async function handleLogout() {
    setLoading(true)
    setAccessToken(null);
    setProfile(null);
    setActiveTaskCategory(-1)
    setActiveCategoryTasksState([])
    await deleteAccessToken();
    setLoading(false)
  }

  useEffect(() => {
    if (attemptedLogin) {
      handleLogin();
      setAttemptedLogin(false);
    }
  }, [attemptedLogin])

  useEffect(() => {
    if (attemptedLogout) {
      handleLogout();
      setAttemptedLogout(false);
    }
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
      setToastMessage({
        title: "Error",
        body: "Error signing in",
        type: "error"
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

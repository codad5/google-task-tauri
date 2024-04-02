import { useEffect} from "react";
import { Box, Button, Spinner, useToast  } from '@chakra-ui/react'
import { getAccessToken, saveAuthCode, handleInitialLogin, handleLoadFrom, handleLogin, handleLogout } from "./helpers/auth";
import { loadContextmenu } from "./helpers/windowhelper";
import TaskPage from "./components/TaskPage";
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { activeTaskCategoryState, attemptLoginState, attemptLogoutState, authLoadingState, isOnlineSelector, loggedInSelector, messageState } from "./config/states";
import Header from "./components/ui/Header";
import { listen_for_auth_code } from "./helpers/eventlistner";
import { SettingsStore } from "./helpers/DBStores";
import settings from "./config/settings";

// disable default context menu on build
loadContextmenu();

function App() {
  const [loading, setLoading] = useRecoilState<boolean>(authLoadingState);
  const activeCategoryValue = useRecoilValue(activeTaskCategoryState)
  const loggedIn = useRecoilValue(loggedInSelector);
  const [attemptedLogin, setAttemptedLogin] = useRecoilState<boolean>(attemptLoginState);
  const [attemptedLogout, setAttemptedLogout] = useRecoilState<boolean>(attemptLogoutState);
  const [toastMessage, setToastMessage] = useRecoilState(messageState)
  const setIsOnline = useSetRecoilState(isOnlineSelector)
  const refreshIsOnline = () => setIsOnline(() => navigator.onLine)

  // error message toast
  const toast = useToast()


  useEffect(() => {
    if (toastMessage) {
      toast.closeAll()
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
  
  useEffect(() => {
    SettingsStore.set(settings.storage.constants.last_active_category, activeCategoryValue).then(() => {console.log("Setting active category")})
  }, [activeCategoryValue])

  

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
    handleInitialLogin().catch((err) => {
        console.log(err); 
        setLoading(false)
        setToastMessage({
          title: "Error",
          body: "Error signing in",
          type: "error"
        })
    }).finally(() => {
      setLoading(false)
    })
  }, [])


  // updating the isonline value every 5 mins
  window.addEventListener('online', () => {
    setToastMessage({
      title: "Network Changed",
      body: "Internet restored",
      type : "success",
    })
    refreshIsOnline()
  })

  window.addEventListener('offline', () => {
    setToastMessage({
      title: "Network Changed",
      body: "No internet",
      type : "error",
    })
    refreshIsOnline()
  })







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

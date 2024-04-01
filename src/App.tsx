import { useEffect} from "react";
import { Box, Button, Spinner, useToast  } from '@chakra-ui/react'
import { getAccessToken, saveAuthCode, handleInitialLogin, handleLoadFrom, handleLogin, handleLogout } from "./helpers/auth";
import { loadContextmenu } from "./helpers/windowhelper";
import TaskPage from "./components/TaskPage";
import { useRecoilState, useRecoilValue } from "recoil";
import { attemptLoginState, attemptLogoutState, authLoadingState, loggedInSelector, messageState } from "./config/states";
import Header from "./components/ui/Header";
import { listen_for_auth_code } from "./helpers/eventlistner";

// disable default context menu on build
loadContextmenu();

function App() {
  const [loading, setLoading] = useRecoilState<boolean>(authLoadingState);
  const loggedIn = useRecoilValue(loggedInSelector);
  const [attemptedLogin, setAttemptedLogin] = useRecoilState<boolean>(attemptLoginState);
  const [attemptedLogout, setAttemptedLogout] = useRecoilState<boolean>(attemptLogoutState);
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

import { useState , useEffect} from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Avatar, Box, Button, Spinner, Wrap, WrapItem, useColorMode, Popover , PopoverTrigger, Portal, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader  } from '@chakra-ui/react'
import TaskPage from "./components/TaskPage";


function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { colorMode, toggleColorMode } = useColorMode()
  
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    // setGreetMsg(await invoke("greet", { name }));
  }

  async function handleLogin() {
    setLoading(true)
    // sleep for 6 seconds
    await new Promise(r => setTimeout(r, 6000));
    if (true) {
      setLoggedIn(true)
    }
    setLoading(false)
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

import { Wrap, WrapItem, Button, Box, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { attemptLoginState, loggedInSelector } from "../../config/states";
import LoggedInHeader from "./LoggedInHeader";


export default function Header() {
    const loggedIn = useRecoilValue(loggedInSelector);
    const setAttemptLogin = useSetRecoilState(attemptLoginState);
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Box textAlign='right'>
            <Wrap spacing="30px" justify="flex-end">
            <WrapItem>
                {
                loggedIn ? <LoggedInHeader /> :  <Button onClick={() => setAttemptLogin(true)}>Signin</Button>
                }
            </WrapItem>
            <WrapItem>
                    <Button onClick={toggleColorMode}>
                        Toggle {colorMode === "light" ? "Dark" : "Light"}
                    </Button>
                </WrapItem>
            </Wrap>
        </Box>
    )
}
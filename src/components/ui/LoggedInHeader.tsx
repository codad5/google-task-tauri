import { Popover, PopoverTrigger, Avatar, Portal, PopoverContent, PopoverArrow, PopoverHeader, PopoverCloseButton, PopoverBody, Button, PopoverFooter } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { attemptLogoutState, userProfileSelector } from "../../config/states";

export default function LoggedInHeader() {
    const profile = useRecoilValue(userProfileSelector);
    const attemptLogout = useSetRecoilState(attemptLogoutState);


    if (!profile) return null;
    
    
    return (
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
                <Button colorScheme="red" onClick={() => attemptLogout(true)}>Logout</Button>
                </PopoverBody>
                <PopoverFooter> Date {new Date().getFullYear()}</PopoverFooter>
            </PopoverContent>
            </Portal>
        </Popover>
    )
}

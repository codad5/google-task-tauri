import { Popover, PopoverTrigger, Avatar, Spacer, Portal, Box, PopoverContent, PopoverArrow, PopoverHeader, PopoverCloseButton, PopoverBody, Button, PopoverFooter } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { attemptLogoutState, userProfileSelector } from "../../config/states";
import AddCategoryComponent from "./AddCategory";

export default function LoggedInHeader() {
    const profile = useRecoilValue(userProfileSelector);
    const attemptLogout = useSetRecoilState(attemptLogoutState);


    if (!profile) return null;
    
    
    return (
        <>
        <Box pr={4}>
            <AddCategoryComponent />
        </Box>
        <Spacer />
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
        </>
    )
}

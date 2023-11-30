import { Box, Flex, Center, IconButton, Link } from '@chakra-ui/react'
import { Link as ReactRouterLink } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

export default function Header() {
    return (
        <Box w="100%" p={2} h="10vh">
        <Flex justifyContent='space-between' alignItems='center' h="100%">
          <Box flexBasis='50%'>
          </Box>
            <Box flexBasis='50%' p={2} h="100%">
                <Flex>
                <Center w='100%' h="100%" flexBasis='50%' px={2} >
                    <Link href="/" textDecoration='underline' to="/"  as={ReactRouterLink}>
                        Home
                    </Link>
                </Center>
                <Center w='100%' h="100%" flexBasis='50%' px={2} >
                    <Link href="/privacy-policy" textDecoration='underline' to="/privacy-policy"  as={ReactRouterLink}>
                        Privacy Policy
                    </Link>
                </Center>
                <Center w='100%' h="100%" flexBasis='50%' px={2} >
                    <Link href="/tos" textDecoration='underline' to="/tos"  as={ReactRouterLink}>
                        Terms of Service
                    </Link>
                </Center>
                <Center h="100%">
                    <Link href="https://github.com/codad5/google-task-tauri" isExternal>
                        <IconButton
                        variant='outline'
                        colorScheme='teal'
                        aria-label='Send email'
                        icon={<FaGithub />}
                        />
                    </Link>
                </Center>
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
}
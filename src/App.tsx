import { Box, Center, Heading, Image, Link, Text, Flex, IconButton, Highlight  } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { FaGithub } from "react-icons/fa";
import { platformLatestData } from './states';
import { getLatestVersionDataFOrThisPlatform } from './libs/helper';
import DownloadButton from './components/DownloadButton';

function App() {
  const [platformLatestDataInfo, setPlatformLatestData] = useRecoilState(platformLatestData);

  useEffect(() => {
    if(platformLatestDataInfo) return;
    getLatestVersionDataFOrThisPlatform().then((data) => {
      setPlatformLatestData(data);
    })
  }, [platformLatestDataInfo])

  return (
    <div className="">
      <Box w="100%" p={2} h="10vh">
        <Flex>
          <Box flexBasis='70%'>
          </Box>
          <Box flexBasis='30%' p={2} h="100%">
            <Center w='100%' h="100%">
              <Link href="https://github.com/codad5/google-task-tauri" isExternal>
                <IconButton
                  variant='outline'
                  colorScheme='teal'
                  aria-label='Send email'
                  icon={<FaGithub />}
                  />
              </Link>
            </Center>
          </Box>
        </Flex>
      </Box>
      <Box w="100%" p={0} h="90vh" pt="10vh">
        <Box w="100%" p={0} h="40vh">
            <Box w="100%" p={0} >
              <Center w='100%' h="100%">
                <Heading as="h5">Google Task Desktop Client</Heading>
              </Center>
            </Box>
          <Box w="100%" p={2}>
            <Center>
              <Image src="/icon.png" alt="Google Task Desktop Client" width="100px" height="100px" borderRadius="full" />
            </Center>  
          </Box>
          <Box w="100%" p={0} >
            <Center w='100%' h="100%" p={2}>
              <Text textAlign="center">
                <Highlight
                  query='Desktop Client'
                  styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}
                >
                This is an Unofficial Google Task Desktop Client. It is not affiliated with Google. It is built with 
                </Highlight>
                <Link href="https://tauri.app/" isExternal>Tauri</Link> and <Link href="https://reactjs.org/" isExternal>React</Link>.
              </Text>
            </Center>
          </Box>
          <Box w="100%" p={5} >
            <Center w='100%' h="100%">
              <DownloadButton />
            </Center>
          </Box>
        </Box>
        <Box w="100%" p={0} h="20vh">
          <Center w='100%' h="100%">
            <Text>
              Google Task Desktop Client By&nbsp;
              <Link href="https://github.com/codad5" isExternal>
                  @codad5
              </Link>
            </Text>
          </Center>
        </Box>
      </Box>
    </div>
  );
}

export default App;

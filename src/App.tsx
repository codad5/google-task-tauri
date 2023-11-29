import { Box, Center, Heading, Image, Link, Text, Flex, IconButton, Highlight  } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { FaGithub } from "react-icons/fa";
import { platformLatestData, requestCount } from './states';
import { getLatestVersionDataFOrThisPlatform } from './libs/helper';
import DownloadButton from './components/DownloadButton';

function App() {
  const [platformLatestDataInfo, setPlatformLatestData] = useRecoilState(platformLatestData);
  const [rateLimit, setRateLimit] = useRecoilState(requestCount);

  useEffect(() => {
    console.log('platformLatestDataInfo', platformLatestDataInfo);
    const interval = setInterval(() => {
      if (platformLatestDataInfo || rateLimit > 5) {
        clearInterval(interval);
        return;
      }
      getLatestVersionDataFOrThisPlatform().then((data) => {
        setPlatformLatestData(data);
      }).catch((err) => {
        console.log(err);
        setPlatformLatestData(null);
      }).finally(() => {
        setRateLimit((prev) => prev + 1);
        console.log('rateLimit', rateLimit);
      })
    }, 3000);
    if(platformLatestDataInfo || rateLimit > 5) clearInterval(interval);
  }, [platformLatestDataInfo])


  useEffect(() => {
    console.log('rateLimit changed', rateLimit);
    if (rateLimit <= 5 || platformLatestDataInfo) return;
    setPlatformLatestData({
      platform: 'other',
      version: '0.0.0',
      url: 'https://github.com/coad5/google-task-tauri/releases',
      date: new Date().toISOString(),
    })
    setTimeout(() => {
      setRateLimit(0);
    }, 1000 * 60 * 60 * 24);
  }, [rateLimit])




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

import { Box, Link, Heading, Text, Center, UnorderedList , ListItem} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import DownloadButton from '../components/DownloadButton'
import Header from '../components/Header'

export default function TermOfService() {
    return (
        <>
            <Header />
            <Box w='100%' p={2} h='100vh'>
                <Center w='100%' h='100%'>
                    <Box w='100%' h='100%'  p={"10%"} >
                        <Heading mb={5}>Application Terms of Service for Google Tasks Desktop by Codad5</Heading>
                        <Text fontSize='lg'>
                            Last updated: 2023-11-29
                        </Text>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Acceptance of Terms </Heading>
                            <Text fontSize='lg'>
                                By downloading, installing, and using Google Tasks Desktop by Codad5 ("the Application"), you agree to comply with and be bound by these Application Terms of Service ("Terms"). If you do not agree with these Terms, please refrain from using the Application.
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Use of the Application </Heading>
                            <Text fontSize='lg'>
                                Our desktop client does not collect any personal information directly. It interacts with the Google Tasks API to provide a desktop interface for managing tasks 
                            </Text>
                            <UnorderedList>
                                <ListItem>
                                    <Heading as='h3' size='md' mb={2}> License </Heading>
                                    <Text fontSize='lg'>
                                         Codad5 grants you a limited, non-exclusive, non-transferable, revocable license to use the Application solely for personal and non-commercial purposes.
                                    </Text>
                                </ListItem>
                                <ListItem>
                                    <Heading as='h3' size='md' mb={2}> Restrictions </Heading>
                                    <Text fontSize='lg'>
                                        You may not:
                                    </Text>
                                    <UnorderedList>
                                        <ListItem> Reverse engineer, decompile, or disassemble the Application. </ListItem>
                                        <ListItem> Modify, translate, adapt, or create derivative works from the Application. </ListItem>
                                        <ListItem> Use the Application for any unlawful or prohibited purpose. </ListItem>
                                    </UnorderedList>
                                </ListItem>
                                <ListItem>
                                    <Heading as='h3' size='md' mb={2}> Modifications to Application </Heading>
                                    <Text fontSize='lg'>
                                        Codad5 may release updates to the Application. By using the Application, you consent to the automatic updates.
                                    </Text>
                                </ListItem>
                            </UnorderedList>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Intellectual Property</Heading>
                            <Text fontSize='lg'>
                                The Application, including but not limited to its code, design, and content, is the property of Codad5 and is protected by intellectual property laws. You agree not to reproduce, distribute, modify, or create derivative works based on the Application.
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> TDisclaimer of Warranty</Heading>
                            <Text fontSize='lg'>
                                The Application is provided "as is" without warranty of any kind. Codad5 makes no warranties, express or implied, regarding the accuracy, completeness, or reliability of the Application.
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Limitation of Liability</Heading>
                            <Text fontSize='lg'>
                                To the extent permitted by law, Codad5 shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use or inability to use the Application.
                            </Text>
                        </Box>
                         <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Governing Law </Heading>
                            <Text fontSize='lg'>
                                These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
                            </Text>
                        </Box>
                         <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Changes to the Terms </Heading>
                            <Text fontSize='lg'>
                                Codad5 reserves the right to modify or replace these Terms at any time. By continuing to use the Application after changes are posted, you accept the modified Terms.
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Contact Us</Heading>
                            <Text fontSize='lg'>
                                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at&nbsp;
                                <Link href='mailto:aniezeoformic@gmail.com' isExternal textDecoration='underline'>
                                    aniezeoformic@gmail.com <ExternalLinkIcon mx='2px' />
                                </Link>
                            </Text>
                        </Box>
                        <DownloadButton />
                    </Box>
                </Center>
            </Box>
        </>
    )
}
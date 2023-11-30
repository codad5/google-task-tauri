import { Box, Link, Heading, Text, Center } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import DownloadButton from '../components/DownloadButton'
import Header from '../components/Header'

export default function PrivacyPolicy() {
    return (
        <>
            <Header />
            <Box w='100%' p={2} h='100vh'>
                <Center w='100%' h='100%'>
                    <Box w='100%' h='100%'  p={"10%"} >
                        <Heading mb={5}>Privacy Policy for Google Tasks Desktop by Codad5</Heading>
                        <Text fontSize='lg'>
                            Last updated: 2023-11-29
                        </Text>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Introduction </Heading>
                            <Text fontSize='lg'>
                                Welcome to Google Tasks Desktop by Codad5! This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our desktop client for Google Tasks. By using our application, you agree to the terms outlined in this policy.
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Information We Collect </Heading>
                            <Text fontSize='lg'>
                                Our desktop client does not collect any personal information directly. It interacts with the Google Tasks API to provide a desktop interface for managing tasks 
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> How We Use Your Information</Heading>
                            <Text fontSize='lg'>
                                As mentioned, we do not collect personal information. However, our application may access and display data from your Google Tasks account, as authorized by you through the Google Tasks API.
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Data Security</Heading>
                            <Text fontSize='lg'>
                                We take the security of your data seriously. Our application communicates securely with the Google Tasks API using industry-standard encryption protocols. We do not store or process any personal data on our servers or any other third-party servers.
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Third-Party Services</Heading>
                            <Text fontSize='lg'>
                                Our application interacts with the Google Tasks API to provide its functionality. Please review Google's privacy policy <Link href='https://policies.google.com/privacy' isExternal>here <ExternalLinkIcon mx='2px' /> </Link> for information on how they handle your data.
                            </Text>
                        </Box>
                        <Box mb={5}>
                            <Heading as='h2' size='lg' mb={2}> Changes to This Privacy Policy</Heading>
                            <Text fontSize='lg'>
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
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
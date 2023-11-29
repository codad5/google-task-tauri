import { Button , Text, Link, Spinner} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import {useRecoilValue} from 'recoil';
import { platformLatestDataSelector } from '../states';
import { getOperationSystem } from '../libs/helper';
import { FaWindows , FaApple , FaLinux, FaDownload  } from "react-icons/fa";
import { OperationSystem } from '../types';



export function getPlaformIconUrl(platform?: OperationSystem) {
    const operationSystem = platform ?? getOperationSystem();
    switch (operationSystem) {
        case "windows":
            return FaWindows ;
        case "mac":
            return FaApple ;
        case "linux":
            return FaLinux ;
        default:
            return FaDownload ;
    }
}

export default function DownloadButton() {
    const platformLatestDataInfo = useRecoilValue(platformLatestDataSelector);
    return (
        <Link href={platformLatestDataInfo?.url} download>
            <Button rightIcon={platformLatestDataInfo ? <Icon as={getPlaformIconUrl()} /> : <Spinner />} colorScheme='teal' variant='solid' size='lg' >
                {
                    !platformLatestDataInfo ? 'Loading...' : (
                        <>
                            <Text>
                                Download {platformLatestDataInfo?.version}
                            </Text>
                        </>
                    )
                }
            </Button>
        </Link>
    );
}
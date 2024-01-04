
import { getOperatingSystemfFromHeaders, getLatestVersionDataFOrThisPlatform } from "@/libs/helper";
import { OperationSystem } from "@/libs/types";
import Link from "next/link";
import { headers } from "next/headers";
import { FaWindows , FaApple , FaLinux, FaDownload  } from "react-icons/fa";




export async function getPlaformIconUrl(platform?: OperationSystem) {
    const operationSystem = platform ?? await getOperatingSystemfFromHeaders(headers())
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

export default async function DownloadButton() {
    const platformLatestDataInfo = await getLatestVersionDataFOrThisPlatform();
    const PlatformIconUrl = await getPlaformIconUrl(platformLatestDataInfo?.platform);
    return (
        <Link href={platformLatestDataInfo?.url ?? '/'}  download>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-row justify-between items-center space-x-2">
                {
                    !platformLatestDataInfo ? 'Loading...' : (
                        <>
                            <div className="flex flex-row justify-between items-center space-x-2">
                                Download {platformLatestDataInfo?.version} for &nbsp; <PlatformIconUrl />
                            </div>
                        </>
                    )
                }
            </button>
        </Link>
    );
}
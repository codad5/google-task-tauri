import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { OperationSystem, githubLatestReleaseData, PlatformData } from "./types";
import {headers} from "next/headers"
const API_URL = "https://api.github.com/repos/codad5/google-task-tauri/releases/latest";


const OsToPlatform : Record<OperationSystem, string[]> = {
    "windows": ["exe"],
    "mac": ["dmg"],
    "linux": ["AppImage", "deb"],
    "other": ["zip", "tar.gz", "AppImage", "deb"],
    "darwin": ["dmg"],
};


export function getOperatingSystemfFromHeaders(headers: ReadonlyHeaders) : OperationSystem {
    const userAgent = headers.get('user-agent');
    if (!userAgent) return "other";
    if (userAgent.includes('Windows')) {
        return 'windows';
    } else if (userAgent.includes('Macintosh')) {
        return 'mac';
    } else if (userAgent.includes('Linux')) {
        return 'linux';
    } else {
        return 'other';
    }
}



// export function getOperationSystem() : OperationSystem {
//     // get operation system from user agent
//     const userAgent = navigator.userAgent.toLowerCase();
//     if (userAgent.indexOf("win32") >= 0 || userAgent.indexOf("wow32") >= 0) {
//         return "windows";
//     }
//     if (userAgent.indexOf("win64") >= 0 || userAgent.indexOf("wow64") >= 0) {
//         return "windows";
//     }
//     if (userAgent.indexOf("mac") >= 0) {
//         return "mac";
//     }
//     if (userAgent.indexOf("linux") >= 0) {
//         return "linux";
//     }
//     return "other";
// }

export async function getLatestJson(): Promise<githubLatestReleaseData|null> {
    return fetch(API_URL, {cache: "force-cache"}).then((response) => {
        // check response status
        if (response.status !== 200) return null;
        const res = response.json()
        // console.log(res);
        return res
    });
}


export async function getLatestVersionData(operationSystem: OperationSystem) : Promise<PlatformData|null> {
    const latestJson = await getLatestJson();
    if (!latestJson || !latestJson.assets) return null;
    // console.log(latestJson);
    const version = latestJson.tag;
    const date = latestJson.published_at;
    const osPlatform = OsToPlatform[operationSystem];
    const data = latestJson.assets.find((asset) => {
        return osPlatform.includes(asset.name.split(".").pop() ?? "");
    }) 
    return data ? {
        platform: operationSystem,
        url: data.browser_download_url,
        version,
        date,
    } : null;
}

export async function getLatestVersionDataFOrThisPlatform() : Promise<PlatformData|null> {
    return await getLatestVersionData(getOperatingSystemfFromHeaders(headers()));
}
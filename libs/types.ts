export type OperationSystem = "windows" | "mac" | "linux" | "other" | "darwin"  

export type PlatformData = {
    platform: OperationSystem;
    url: string;
    version: string;
    date: string;

};

export type githubPlaformData = {
    url: string;
    name: string;
    browser_download_url: string;
    download_count: number;
    size: number;
};

export type githubPlaformsData =  githubPlaformData[]

export type githubLatestReleaseData = {
    name: string;
    published_at: string;
    body: string;
    assets: githubPlaformsData;
    tag: string;
    draft: boolean;
};

export type postsType = {
    slug: string,
    title: string,
    date: string,
    description: string,
    tags: string|string[]
    image?: string,
    published?: boolean
}
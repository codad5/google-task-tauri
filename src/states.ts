import { atom, selector } from 'recoil';
import { PlatformData } from './types';

export const platformLatestData = atom<PlatformData | null>({
    key: 'platformLatestData',
    default: null,
});

export const requestCount = atom<number>({
    key: 'requestCount',
    default: 0,
});


export const platformLatestDataSelector = selector<PlatformData | null>({
    key: 'platformLatestDataSelector',
    get: ({ get }) => {
        const platformData = get(platformLatestData);
        return platformData;
    },
});

export const lastestVersion = selector<string | null>({
    key: 'lastestVersionSelector',
    get: ({ get }) => {
        const platformData = get(platformLatestData);
        return platformData?.version ?? null;
    },
});

export const requestCountSelector = selector<number>({
    key: 'requestCountSelector',
    get: ({ get }) => {
        const count = get(requestCount);
        return count;
    },
});
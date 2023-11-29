import { atom, selector } from 'recoil';
import { PlatformData } from './types';

export const platformLatestData = atom<PlatformData | null>({
    key: 'platformLatestData',
    default: null,
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
class Cache  <T = any> {
    private cache : { [key: string]: T } = {};
    private lastUpdate: { [key: string]: Date } = {};

    constructor() {
        this.cache = {};
        this.lastUpdate = {};
    }

    get(key: string) {
        return this.cache[key];
    }

    set(key: string, value: any) {
        this.cache[key] = value;
        this.lastUpdate[key] = new Date();
    }

    getCache(key: string) {
        return this.cache[key];
    }

    getLastUpdate(key: string) {
        return this.lastUpdate[key];
    }

    clearCache(key: string) {
        this.lastUpdate[key] = new Date(0);
    }

}

const _GloablCacher = new Cache();

class GlobalCacheManager <T = any> {
    private key: string = "default";

    constructor(key?: string) {
        if (key) this.key = key;
        _GloablCacher.set(this.key, null);
    }

    get() : T {
        return _GloablCacher.get(this.key);
    }

    set(value: T) {
        _GloablCacher.set(this.key, value);
    }

    update(value: T) {
        this.set(value);
    }

    lastUpdate() {
        return _GloablCacher.getLastUpdate(this.key);
    }

    clearCache() {
        _GloablCacher.clearCache(this.key);
    }
}

export {GlobalCacheManager, Cache};
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

const Cacher = new Cache();

class CacheManager <T = any> {
    private key: string = "default";

    constructor(key?: string) {
        if (key) this.key = key;
        Cacher.set(this.key, null);
    }

    get() : T {
        return Cacher.get(this.key);
    }

    set(value: T) {
        Cacher.set(this.key, value);
    }

    update(value: T) {
        this.set(value);
    }

    lastUpdate() {
        return Cacher.getLastUpdate(this.key);
    }

    clearCache() {
        Cacher.clearCache(this.key);
    }
}

export {CacheManager, Cacher};
export class CacheUtils {

    static getItem<T>(key: string, defaultValue?: T | (() => T), saveDefaultToCache?: boolean): T {
        const value = localStorage.getItem(key);
        if (value) {
            const cache = JSON.parse(value);
            if (cache.expire !== 0 && cache.expire < new Date().getTime()) {
                this.removeItem(key)
            } else if (cache.value) {
                return cache.value as T;
            }
        }
        const newValue = typeof defaultValue === 'function'
            ? (defaultValue as Function)()
            : defaultValue;
        if (saveDefaultToCache) {
            CacheUtils.setItem(key, newValue);
        }
        return newValue;
    }

    static setItem(key: string, value: any, expire = 0) {
        if (expire !== 0) {
            expire = new Date().getTime() + expire
        }
        localStorage.setItem(key, JSON.stringify({value, expire: expire}));
    }

    static removeItem(key: string) {
        localStorage.removeItem(key);
    }
}

export const CACHE_RULE_KEY = "rule";
export const CACHE_BOARD_KEY = "board";
export const CACHE_ROOM_KEY = "room";

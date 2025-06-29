// src/utils/cache.ts
interface CacheEntry<T> {
    expiry: number;
    data: T;
  }
  
  const store = new Map<string, CacheEntry<any>>();
  
  /**
   * Generic in-memory cache.
   * @param key    unique string
   * @param ttl    seconds to live
   * @param fetcher  function that returns fresh T
   */
  export async function cache<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const now = Date.now();
    const cached = store.get(key);
    if (cached && cached.expiry > now) {
      return cached.data as T;
    }
    const fresh = await fetcher();
    store.set(key, { expiry: now + ttl * 1000, data: fresh });
    return fresh;
  }
  
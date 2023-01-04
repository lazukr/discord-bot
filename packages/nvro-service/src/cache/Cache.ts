export interface Cache<Key, Value> {
    get(key: Key): Promise<Value>;
    retrieve(key: Key): Promise<Value>;
}

export interface ItemCacheRetrievefunction<Key, Value> {
    (key: Key): Promise<Value>;
}
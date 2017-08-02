/// <reference types="cordova"/>

interface ICordovaSecureStorage {
    set(success: (key?: string) => void, fail: (err: string) => void, key: string, value: string): void;
    get(success: (value: any) => void, fail: (err: string) => void, key: string): void;
    remove(success: (key?: string) => void, fail: (err: string) => void, key: string): void;
    clear(success: () => void, fail: (err: string) => void): void;
    keys(success: (keys: string[]) => void, fail: (err: string) => void): void;
}

interface CordovaPlugins {
    SecureStorage: new (success: () => void, fail: (err: string) => void, namespaced: string) => ICordovaSecureStorage;
}

/// <reference types="cordova"/>

interface ICordovaSecureStorage {
    set(success: (key?: string) => void, fail: (err: Error) => void, key: string, value: string): void;
    get(success: (value: any) => void, fail: (err: Error) => void, key: string): void;
    remove(success: (key?: string) => void, fail: (err: Error) => void, key: string): void;
    clear(success: () => void, fail: (err: Error) => void): void;
    keys(success: (keys: string[]) => void, fail: (err: Error) => void): void;
}

interface CordovaPlugins {
    SecureStorage: new (success: () => void, fail: (err: Error) => void, namespaced: string) => ICordovaSecureStorage;
}

/// <reference path="../_dev.dependencies.d.ts" />
/// <reference path="../NativeBridge/StubLocalContentProvider.ts" />
/// <reference path="StubPurchase.ts" />
/// <reference path="StubFIWatchSetting.ts" />
/// <reference path="StubFIWatchTransfer.ts" />
/// <reference path="StubSkinCollectionSync.ts" />
/// <reference path="StubInstalledSkinCollection.ts" />

namespace FES.Model {

    const TAG = "[FES.Model.DevOptions] ";

    /**
     * @class DevOptions
     * @brief 開発用オプションモデル
     */
    export class DevOptions extends Backbone.Model {
        static s_instance: DevOptions = null;

        //! constructor
        constructor() {
            super();
            this.init();
        }

        ///////////////////////////////////////////////////////////////////////
        // public static method

        //! get singleton instance
        public static getInstance(): DevOptions {
            if (!DevOptions.s_instance) {
                DevOptions.s_instance = new DevOptions();
            }
            return DevOptions.s_instance;
        }

        //! 値のリセット
        public static reset(): void {
            localStorage.clear();
            if (DevOptions.s_instance) {
                DevOptions.s_instance.init(true);
            }
        }

        //! stub コンテンツが有効化判定
        public static isUsingStub(): boolean {
            return !!DevOptions.s_instance.get("useStub");
        }

        ///////////////////////////////////////////////////////////////////////
        // private method

        //! ローカルストレージからデータ取得
        private getStorageData(key: string): any {
            let value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            } else {
                return null;
            }
        }

        //! ローカルストレージからデータ取得
        private setStorageData(key: string, data: any): void {
            localStorage.setItem(key, JSON.stringify(data));
        }

        //! 初期化
        private init(update?: boolean): void {
            // 汎用初期化スコープ
            (() => {
                let keys = [
                    "transition",
                    "useStub",
                    "homectrl",
                ];

                let initValue = (key: string) => {
                    let value = this.getStorageData(key);
                    if (null != value) {
                        super.set(key, value);
                    } else if (update && null != this.defaults()[key]) {
                        super.set(key, this.defaults()[key]);
                    }
                };

                for (let i = 0, n = keys.length; i < n; i++) {
                    initValue(keys[i]);
                }

                //! stub の適用
                this.setStubStuff(this.get("useStub"));
            })();
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: Backbone.Model

        set(attributeName: string, value: any, options?: Backbone.ModelSetOptions): Backbone.Model {
            if ("string" === typeof attributeName) {
                this.setStorageData(attributeName, value);
            }
            if ("useStub" === attributeName) {
                this.setStubStuff(value);
            }
            return super.set(attributeName, value, options);
        }

        /**
         * default 属性
         */
        defaults(): any {
            return {
                transition: "fadeup",
                useStub: false,
                homectrl: "trans:none",
            };
        }

        ///////////////////////////////////////////////////////////////////////
        // private methods

        //! スタブの適用 (再起動が必要なものあり)
        private setStubStuff(enabled: boolean): void {
            // Unit Test 対策
            if (CDP.global.Config.DEV_FUNCTIONS_ENABLED) {
                if (enabled) {
                    NativeBridge.applyStubLocalContentProvider();
                    applyStubPurchase();
                    applyStubFIWatchSetting();
                    applyStubFIWatchTransfer();
                    applyStubSkinCollectionSync();
                    applyStubInstalledSkinCollection();
                } else {
                    NativeBridge.detachStubLocalContentProvider();
                    detachStubPurchase();
                    detachStubFIWatchSetting();
                    detachStubFIWatchTransfer();
                    detachStubSkinCollectionSync();
                    detachStubInstalledSkinCollection();
                }
            }
        }
    }

    // Stub の有効化
    DevOptions.getInstance();
}

namespace CDP.NativeBridge {

    import IPromiseBase = CDP.IPromiseBase;
    import IPromise     = CDP.IPromise;

    const TAG = "[CDP.NativeBridge.Utils] ";

    /**
     * \~english
     * @class Utils
     * @brief The utility class for CDP.NativeBridge.
     *
     * \~japanese
     * @class Utils
     * @brief CDP.NativeBridge が使用するユーティリティクラス
     */
    export class Utils {

        private static s_pluginReady = false;

        ///////////////////////////////////////////////////////////////////////
        // public static methods

        /**
         * \~english
         * Defines error code map from the plugin result to CDP.NativeBridge result code.
         *
         * @param errorCode [in] set result code string. ex): "SUCCESS_OK"
         *
         * \~japanese
         * plugin の Result Code を CDP.NativeBridge にマップする
         *
         * @param errorCode [in] Result Code 文字列を指定 ex): "SUCCESS_OK"
         */
        public static defineResultCode(errorCode: string): void {
            Object.defineProperty(NativeBridge, errorCode, {
                get: function () {
                    if (Utils.s_pluginReady) {
                        return Plugin.NativeBridge[errorCode];
                    } else {
                        return null;
                    }
                },
                enumerable: true,
                configurable: true
            });
        }

        /**
         * \~english
         * Wait for cordova "deviceready" event fired.
         *
         * \~japanese
         * cordova が 使用可能になるまで待機
         */
        public static waitForPluginReady(): IPromiseBase<void> {
            const df = $.Deferred<void>();

            if (Utils.s_pluginReady) {
                return $.Deferred<void>().resolve();
            }

            try {
                const channel = cordova.require("cordova/channel");
                channel.onCordovaReady.subscribe(() => {
                    if (null != CDP.Plugin.NativeBridge) {
                        Utils.s_pluginReady = true;
                        df.resolve();
                    } else {
                        df.reject(TAG + "'cordova-plugin-cdp-nativebridge' cordova plugin required.");
                    }
                });
            } catch (error) {
                df.reject(TAG + "cordova required.");
            }

            return df.promise();
        }

        /**
         * \~english
         * Create NativeBridge.Promise object from jQueryDeferred object.
         *
         * @param df [in] set jQueryDeferred instance.
         * @returns NativeBridge.Promise object.
         *
         * \~japanese
         * Promise オブジェクトの作成
         * jQueryDeferred オブジェクトから、NativeBridge.Promise オブジェクトを作成する
         *
         * @param df [in] jQueryDeferred instance を指定
         * @returns NativeBridge.Promise オブジェクト
         */
        public static makePromise(df: JQueryDeferred<IResult>): IPromise<IResult> {
            return CDP.makePromise(df, {
                _bridge: null,
                _taskId: null,
                abort: function (info?: any): void {
                    const detail = $.extend({
                        code: NativeBridge.ERROR_CANCEL,
                        message: "abort",
                        name: TAG + "ERROR_CANCEL",
                        taskId: this._taskId,
                    }, info);

                    const cancel = () => {
                        if (null != this._bridge && null != this._taskId) {
                            this._bridge.cancel(this._taskId, detail);
                        }
                        df.reject(detail);
                    };

                    if (null != this.dependency) {
                        if (this.dependency.abort) {
                            this.dependency.abort(detail);
                        } else {
                            console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
                        }
                        if (this.callReject && "pending" === this.state()) {
                            cancel();
                        }
                    } else if ("pending" === this.state()) {
                        cancel();
                    }
                }
            });
        }

        /**
         * \~english
         * Helper function to correctly set up the prototype chain, for subclasses.
         * The function behavior is same as extend() function of Backbone.js.
         *
         * @param protoProps  [in] set prototype properties as object.
         * @param staticProps [in] set static properties as object.
         * @returns subclass constructor.
         *
         * \~japanese
         * クラス継承のためのヘルパー関数
         * Backbone.js extend() 関数と同等
         *
         * @param protoProps  [in] prototype properties をオブジェクトで指定
         * @param staticProps [in] static properties をオブジェクトで指定
         * @returns サブクラスのコンストラクタ
         */
        public static extend(protoProps: object, staticProps?: object): object {
            const parent = this;
            let child;

            if (protoProps && protoProps.hasOwnProperty("constructor")) {
                child = protoProps.constructor;
            } else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }

            $.extend(child, parent, staticProps);

            const Surrogate = function () {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

            if (protoProps) {
                $.extend(child.prototype, protoProps);
            }

            child.__super__ = parent.prototype;

            return child;
        }
    }
}

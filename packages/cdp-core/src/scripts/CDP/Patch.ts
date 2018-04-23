namespace CDP {

    const TAG: string = "[CDP.Patch] ";

    /**
     * @en Utility class for appling the patch to the run time environment.
     * @ja 実行環境用 Patch 適用ユーティリティクラス
     *
     * @internal
     */
    export class Patch {
        ///////////////////////////////////////////////////////////////////////
        // public static methods:

        /**
         * @en Apply the patch
         * @ja パッチの適用
         *
         * @internal
         */
        public static apply(): void {
            Patch.consolePatch();
            Patch.nodePatch();
        }

        ///////////////////////////////////////////////////////////////////////
        // private static methods:

        // console 用 patch
        private static consolePatch(): void {
            if (null == global.console || null == global.console.error) {
                global.console = {
                    count:                      function () { /* dummy */ },
                    groupEnd:                   function () { /* dummy */ },
                    time:                       function () { /* dummy */ },
                    timeEnd:                    function () { /* dummy */ },
                    trace:                      function () { /* dummy */ },
                    group:                      function () { /* dummy */ },
                    dirxml:                     function () { /* dummy */ },
                    debug:                      function () { /* dummy */ },
                    groupCollapsed:             function () { /* dummy */ },
                    select:                     function () { /* dummy */ },
                    info:                       function () { /* dummy */ },
                    profile:                    function () { /* dummy */ },
                    assert:                     function () { /* dummy */ },
                    msIsIndependentlyComposed:  function () { /* dummy */ },
                    clear:                      function () { /* dummy */ },
                    dir:                        function () { /* dummy */ },
                    warn:                       function () { /* dummy */ },
                    error:                      function () { /* dummy */ },
                    log:                        function () { /* dummy */ },
                    profileEnd:                 function () { /* dummy */ }
                };
            }
        }

        // WinRT 用 patch
        private static nodePatch(): void {
            if ("object" === global.MSApp) {
                const _MSApp: any = global.MSApp;

                const originalAppendChild = Node.prototype.appendChild;
                Node.prototype.appendChild = function (node: any) {
                    const self = this;
                    return _MSApp.execUnsafeLocalFunction(function () {
                        return originalAppendChild.call(self, node);
                    });
                };

                const originalInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function (newElement: any, referenceElement: Node) {
                    const self = this;
                    return _MSApp.execUnsafeLocalFunction(function () {
                        return originalInsertBefore.call(self, newElement, referenceElement);
                    });
                };
            }
        }
    }
}

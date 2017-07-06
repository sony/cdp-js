/**
 * @file  Utils.
 * @brief Tools 専用のユーティリティ
 */
namespace CDP.Tools {
    // cdp.tools は cdp.core に依存しないため、独自にglobal を提供する
    export const global = (<any>CDP).global || Function("return this")();
}

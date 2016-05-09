/// <amd-dependency path="cdp.framework.jqm" />

/* tslint:disable:max-line-length */

/**
 * PhoneGap が有効になるまで待機
 * PC 環境ではエミュレートされる。
 */
export let waitForDeviceReady: () => JQueryPromise<{}> = CDP.waitForDeviceReady;

/**
 * H/W Back key handler の設定.
 *
 * @param  {Function} handler 指定.
 * @return {Function} 以前の handler.
 */
export let setBackButtonHandler: (handler: (event?: JQueryEventObject) => void) => (event?: JQueryEventObject) => void = CDP.setBackButtonHandler;

/// <amd-dependency path="cdp.framework.jqm" />

/**
 * PhoneGap が有効になるまで待機
 * PC 環境ではエミュレートされる。
 */
export let waitForDeviceReady = CDP.waitForDeviceReady;

/**
 * H/W Back key handler の設定.
 *
 * @param  {Function} handler 指定.
 * @return {Function} 以前の handler.
 */
export let setBackButtonHandler = CDP.setBackButtonHandler;

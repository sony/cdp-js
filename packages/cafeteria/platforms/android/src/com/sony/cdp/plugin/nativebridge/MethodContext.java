package com.sony.cdp.plugin.nativebridge;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * \~english
 * @class MethodContext
 * @brief The class stores method's context information.
 *        cordova CallbackContext compatible.
 *
 * \~japanese
 * @class MethodContext
 * @brief Method のコンテキストを格納するクラス
 *         cordova CallbackContext 互換
 */
public final class MethodContext extends CallbackContext {
    public final String    className;
    public final String    methodName;
    public final JSONArray methodArgs;
    public final String    objectId;
    public final String    taskId;
    public final boolean  compatible;
    public final String    threadId = Thread.currentThread().getName();
    public        boolean  needSendResult = true;

    /**
     * \~english
     * constructor
     *
     * @param callbackId [in] set callback ID.
     * @param webView    [in] set CordovaWebView instance.
     * @param args       [in] set the arguments which received NativeBridge.
     * @throws JSONException
     *
     * \~japanese
     * constructor
     *
     * @param callbackId [in] callback ID を指定
     * @param webView    [in] CordovaWebView を指定
     * @param args       [in] NativeBridge に渡された引数を指定
     * @throws JSONException
     */
    public MethodContext(String callbackId, CordovaWebView webView, JSONArray args) throws JSONException {
        super(callbackId, webView);
        JSONObject execInfo = args.getJSONObject(0);
        JSONObject feature = execInfo.getJSONObject("feature");
        this.className  = feature.isNull("android") ? null : feature.getJSONObject("android").getString("packageInfo");
        this.methodName = execInfo.isNull("method") ? null : execInfo.getString("method");
        this.methodArgs = getMethodArgs(args);
        this.objectId   = execInfo.getString("objectId");
        this.taskId     = execInfo.isNull("taskId") ? null : execInfo.getString("taskId");
        this.compatible = execInfo.getBoolean("compatible");
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    /**
     * \~english
     * Translate to method arguments from raw arguments.
     *
     * @param rawArgs [in] the arguments which set cordova.exec().
     * @return JSONArray argument list (1 base).
     * @throws JSONException
     *
     * \~japanese
     * 生引数をメソッド引数に変換
     *
     * @param rawArgs [in] cordova.exec() に指定された引数
     * @return JSONArray (index == 1 からの引数リスト)
     * @throws JSONException
     */
    private JSONArray getMethodArgs(JSONArray rawArgs) throws JSONException {
        JSONArray methodArgs = new JSONArray();
        for (int i = 1; i < rawArgs.length(); i++) {
            methodArgs.put(rawArgs.get(i));
        }
        return methodArgs;
    }

}

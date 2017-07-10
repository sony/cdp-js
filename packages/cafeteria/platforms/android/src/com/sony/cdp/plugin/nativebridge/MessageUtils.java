package com.sony.cdp.plugin.nativebridge;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.util.SparseArray;

/**
 * \~english
 * @class MessageUtils
 * @brief The utility class for generating Cordova PluginResult of cdp.plugin.nativebridge.
 *
 * \~japanese
 * @class MessageUtils
 * @brief cdp.plugin.nativebridge の Cordova PluginResult メッセージを生成するユーティリティクラス
 */
public final class MessageUtils {

    private static final String TAG = "[com.sony.cdp.plugin.nativebridge][Native][MessageUtils] ";

    // Result Code
    public static final int SUCCESS_OK                 = 0x0000;
    public static final int SUCCESS_PROGRESS           = 0x0001;
    public static final int ERROR_FAIL                 = 0x0002;
    public static final int ERROR_CANCEL               = 0x0003;
    public static final int ERROR_INVALID_ARG          = 0x0004;
    public static final int ERROR_NOT_IMPLEMENT        = 0x0005;
    public static final int ERROR_NOT_SUPPORT          = 0x0006;
    public static final int ERROR_INVALID_OPERATION    = 0x0007;
    public static final int ERROR_CLASS_NOT_FOUND      = 0x0008;
    public static final int ERROR_METHOD_NOT_FOUND     = 0x0009;

    private static SparseArray<String> mErrorTbl = null;

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    /**
     * \~english
     * Generate result information.
     *
     * @param code    [in] set result code.
     * @param message [in] set string information.
     * @param taskId  [in] set task ID.
     * @param params  [in] set pamaeters as variant args.
     * @return PluginResult as JSONObject.
     *
     * \~japanese
     * Result 情報を生成
     *
     * @param code    [in] Result Code を指定
     * @param message [in] 文字列情報を指定 (任意)
     * @param taskId  [in] task ID を指定
     * @param params  [in] pamaeter 情報を可変引数で指定
     * @return PluginResult に渡す JSONObject を返却
     */
    public static JSONObject makeMessage(int code, String message, String taskId, Object... params) {
        if (null == mErrorTbl) {
            init();
        }

        JSONObject result = null;

        try {
            String name = (null != mErrorTbl.get(code)) ? mErrorTbl.get(code) : String.format("ERROR_CUSTOM:0x%x", code);
            result = new JSONObject();
            result.put("code", code);
            result.put("name", TAG + name);
            if (null != message) {
                result.put("message", message);
            }
            if (null != taskId) {
                result.put("taskId", taskId);
            }
            if (0 < params.length) {
                JSONArray paramsInfo = new JSONArray();
                for (int i = 0; i < params.length; i++) {
                    paramsInfo.put(params[i]);
                }
                result.put("params", paramsInfo);
            }
        } catch (JSONException e) {
            Log.e(TAG, "create result JSON object failed.", e);
        }

        return result;
    }

    /**
     * \~english
     * Generate result information.
     * helper function.
     *
     * @param message [in] set string information.
     * @param taskId  [in] set task ID.
     * @param params  [in] set pamaeters as variant args.
     * @return PluginResult as JSONObject.
     *
     * \~japanese
     * Result 情報を生成
     * ヘルパー関数
     *
     * @param message [in] 文字列情報を指定 (任意)
     * @param taskId  [in] task ID を指定
     * @param params  [in] pamaeter 情報を可変引数で指定
     * @return PluginResult に渡す JSONObject を返却
     */
    public static JSONObject makeMessage(String message, String taskId, Object... params) {
        return makeMessage(SUCCESS_OK, message, taskId, params);
    }

    /**
     * \~english
     * Generate result information.
     * helper function.
     *
     * @param taskId  [in] set task ID.
     * @param params  [in] set pamaeters as variant args.
     * @return PluginResult as JSONObject.
     *
     * \~japanese
     * Result 情報を生成
     * ヘルパー関数
     *
     * @param taskId  [in] task ID を指定
     * @param params  [in] pamaeter 情報を可変引数で指定
     * @return PluginResult に渡す JSONObject を返却
     */
    public static JSONObject makeMessage(String taskId, Object... params) {
        return makeMessage(SUCCESS_OK, null, taskId, params);
    }

    /**
     * \~english
     * Send success information.
     * helper function.
     *
     * @param callbackContext [in] set CallbackContext.
     * @param taskId          [in] set task ID.
     *
     * \~japanese
     * Success 情報を送信
     * ヘルパー関数
     *
     * @param callbackContext [in] CallbackContext を指定
     * @param taskId          [in] task ID を指定
     */
    public static void sendSuccessResult(CallbackContext callbackContext, String taskId) {
        sendSuccessResult(callbackContext, makeMessage(taskId));
    }

    /**
     * \~english
     * Send success information.
     *
     * @param callbackContext [in] set CallbackContext.
     * @param result          [in] JSONObject created by makeMessage().
     *
     * \~japanese
     * Success 情報を送信
     *
     * @param callbackContext [in] CallbackContext を指定
     * @param result          [in] makeMessage() で生成した JSONObject を指定
     */
    public static void sendSuccessResult(CallbackContext callbackContext, JSONObject result) {
        try {
            if (null == result) {
                result = makeMessage(null);
            } else if (result.isNull("code")) {
                result.put("code", SUCCESS_OK);
            }
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, result));
        } catch (JSONException e) {
            Log.e(TAG, "create result JSON object failed.", e);
        }
    }

    /**
     * \~english
     * Send error information.
     * helper function.
     *
     * @param callbackContext [in] set CallbackContext.
     * @param taskId          [in] set task ID.
     * @param code            [in] set result code.
     * @param message         [in] set string information.
     *
     * \~japanese
     * Error 情報を送信
     * ヘルパー関数
     *
     * @param callbackContext [in] CallbackContext を指定
     * @param taskId          [in] task ID を指定
     * @param code            [in] Result Code を指定
     * @param message         [in] 文字列情報を指定 (任意)
     */
    public static void sendErrorResult(CallbackContext callbackContext, String taskId, int code, String message) {
        sendErrorResult(callbackContext, makeMessage(code, message, taskId));
    }

    /**
     * \~english
     * Send error information.
     *
     * @param callbackContext [in] set CallbackContext.
     * @param result          [in] JSONObject created by makeMessage().
     *
     * \~japanese
     * Error 情報を送信
     *
     * @param callbackContext [in] CallbackContext を指定
     * @param result          [in] makeMessage() で生成した JSONObject を指定
     */
    public static void sendErrorResult(CallbackContext callbackContext, JSONObject result) {
        try {
            if (null == result) {
                result = makeMessage(ERROR_FAIL, null, null);
            } else if (result.isNull("code")) {
                result.put("code", ERROR_FAIL);
            }
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, result));
        } catch (JSONException e) {
            Log.e(TAG, "create result JSON object failed.", e);
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    //! initialize error table.
    private synchronized static void init() {
        // double checked locking pattern
        if (null == mErrorTbl) {
            mErrorTbl = new SparseArray<String>();
            mErrorTbl.put(SUCCESS_OK,               "SUCCESS_OK");
            mErrorTbl.put(SUCCESS_PROGRESS,         "SUCCESS_PROGRESS");
            mErrorTbl.put(ERROR_FAIL,               "ERROR_FAIL");
            mErrorTbl.put(ERROR_CANCEL,             "ERROR_CANCEL");
            mErrorTbl.put(ERROR_INVALID_ARG,        "ERROR_INVALID_ARG");
            mErrorTbl.put(ERROR_NOT_IMPLEMENT,      "ERROR_NOT_IMPLEMENT");
            mErrorTbl.put(ERROR_NOT_SUPPORT,        "ERROR_NOT_SUPPORT");
            mErrorTbl.put(ERROR_INVALID_OPERATION,  "ERROR_INVALID_OPERATION");
            mErrorTbl.put(ERROR_CLASS_NOT_FOUND,    "ERROR_CLASS_NOT_FOUND");
            mErrorTbl.put(ERROR_CLASS_NOT_FOUND,    "ERROR_CLASS_NOT_FOUND");
            mErrorTbl.put(ERROR_METHOD_NOT_FOUND,   "ERROR_METHOD_NOT_FOUND");
        }
    }
}

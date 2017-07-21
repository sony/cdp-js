package com.sony.cdp.cafeteria.nativebridge;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.sony.cdp.plugin.nativebridge.Gate;
import com.sony.cdp.plugin.nativebridge.MessageUtils;
import com.sony.cdp.plugin.nativebridge.MethodContext;


/**
 * \~english
 * @class SimpleGate
 * @brief Sample for gate derived class.
 *
 * \~japanese
 * @class SimpleGate
 * @brief サンプル Gate クラス
 */
public class SimpleGate extends Gate {
    private static final String TAG = "[Native][SimpleGate] ";

    ///////////////////////////////////////////////////////////////////////
    // public mehtods

    /**
     * \~english
     * Sample method.
     * You can receive method with arguments that called from JavaScript layer.
     * Numeric value is fixed as double.
     *
     * you can use follow method for returning value.
     *  - returnParams()
     *
     * @throws JSONException
     *
     * \~japanese
     * サンプルメソッド
     * JavaScript レイヤで指定したメソッドと引数を受けることができる
     * 数値は double 固定
     *
     * 値を戻すには
     *  - returnParams()
     * を使用する。
     *
     * @throws JSONException
     */
    public void coolMethod(double arg1, boolean arg2, String arg3, JSONObject arg4) throws JSONException {
        String msg = "[ANDROID:coolMethod] arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
        msg += (", OBJECT: " + String.valueOf(arg4.getBoolean("ok")));
        returnParams(msg);
    }

    /**
     * \~english
     * Sample method.
     * void version.
     *
     * \~japanese
     * サンプルメソッド
     * void 版
     */
    public void voidMethod() {
        Log.d(TAG, "void voidMethod(void), called.");
    }

    /**
     * \~english
     * Sample mehtod (Threading)
     * If argument type defined with "final", the framework can resolve refrection.
     * You can get MethodContext object that is compatible CallbackContext by calling getContext().
     *
     * You can use the follow methods in worker thread.
     *  - notifyParams()
     *  - resolveParams()
     *  - rejectParams()
     *
     * \~japanese
     * サンプルメソッド (スレッドを扱う例)
     * 引数に "final" を指定しても、リフレクションコール可能
     * getContext() より、MethodContextにアクセスが可能
     *
     * スレッド内では
     *  - notifyParams()
     *  - resolveParams()
     *  - rejectParams()
     * がそれぞれ使用可能
     */
    public void threadMethod(final double arg1, final boolean arg2, final String arg3, final JSONObject arg4) {
        // context の取得は呼び出し thread でのみ有効
        final MethodContext context = getContext();

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                try {
                    notifyParams(context, (int)arg1, arg2);
                    notifyParams(context, arg3, arg4);
                    String msg = "[ANDROID:threadMethod] arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
                    msg += (", OBJECT: " + String.valueOf(arg4.getBoolean("ok")));
                    resolveParams(context, msg);
                } catch (JSONException e) {
                    errorMsg = "Invalid JSON object";
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, context);
                }
            }
        });
    }

    /**
     * \~english
     * Example of worker thread and canceling.
     * This sample notifies progress information by 100 [msec] until cancel() is called.
     *
     * \~japanese
     * ワーカースレッドとキャンセルの例
     * cancel() がコールされるまで、100 [msec] ごとに進捗を通知するサンプル
     */
    public void progressMethod() {
        // context の取得は呼び出し thread でのみ有効
        final MethodContext context = getContext();

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                int progress = 0;
                try {
                    setCancelable(context);
                    while (true) {
                        if (100 < progress) {
                            resolveParams(context);
                            break;
                        }
                        if (isCanceled(context)) {
                            rejectParams(MessageUtils.ERROR_CANCEL, TAG + "progressMethod() canceled.", context);
                            break;
                        }
                        notifyParams(context, progress);
                        progress++;
                        Thread.sleep(100);
                    }
                } catch (InterruptedException e) {
                    errorMsg = "InterruptedException occur.";
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, context);
                } finally {
                    removeCancelable(context);
                }
            }
        });
    }

    //! Cancel event handler.
    @Override
    protected void onCancel(String taskId) {
        Log.d(TAG, "cancel task: " + taskId);
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: NativeBridge

    /**
     * \~english
     * Cordova compatible handler.
     * The method called from NativeBridge.
     * Them method called when compatible option is enabled.
     * The client can override this method.
     *
     * @param action          [in] action name.
     * @param args            [in] exec() arguments.
     * @param callbackContext [in] CallbackContext object. you can do down-cast to MethodContext object always.
     * @return success or failure true:success / false: failure
     *
     * \~japanese
     * Cordova 互換ハンドラ
     * NativeBridge からコールされる
     * compatible オプションが有効な場合、このメソッドがコールされる
     * 拡張情報は context に格納される。
     * クライアントは本メソッドをオーバーライド可能
     *
     * @param action          [in] アクション名.
     * @param args            [in] exec() 引数.
     * @param callbackContext [in] CallbackContext を格納. MethodContext にダウンキャスト可能
     * @return  action の成否 true:成功 / false: 失敗
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        // callbackContext は MethodContext にダウンキャスト可能
        MethodContext context = (MethodContext)callbackContext;

        if (action.equals("compatibleCheck")) {
            JSONArray message = new JSONArray();
            message.put(context.taskId);
            JSONObject argsInfo = new JSONObject();
            argsInfo.put("taskId", context.taskId);
            argsInfo.put("arg1", args.getInt(0));
            argsInfo.put("arg2", args.getBoolean(1));
            argsInfo.put("arg3", args.getString(2));
            argsInfo.put("arg4", args.getJSONObject(3));
            message.put(argsInfo);
            context.success(message);
            return true;
        }
        return false;
    }
}

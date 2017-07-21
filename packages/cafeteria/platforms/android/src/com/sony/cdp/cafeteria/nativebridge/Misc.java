package com.sony.cdp.cafeteria.nativebridge;

import com.sony.cdp.plugin.nativebridge.Gate;
import com.sony.cdp.plugin.nativebridge.MethodContext;

/**
 * Misc
 * アプリケーション仕様を実現する上で雑多なNative処理を実現するクラス
 */
public class Misc extends Gate {

    private MethodContext mChangeFocusContext = null;

    ///////////////////////////////////////////////////////////////////////
    // public methods:

    /**
     * UUID を生成して文字列で返却
     */
    public void generateUUID() {
        returnParams(java.util.UUID.randomUUID().toString());
    }
}

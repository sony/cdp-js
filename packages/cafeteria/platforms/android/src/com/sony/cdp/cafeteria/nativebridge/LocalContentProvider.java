package com.sony.cdp.cafeteria.nativebridge;

import android.content.ContentResolver;
import android.database.Cursor;
import android.database.sqlite.SQLiteException;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;

import com.sony.cdp.plugin.nativebridge.Gate;
import com.sony.cdp.plugin.nativebridge.MessageUtils;
import com.sony.cdp.plugin.nativebridge.MethodContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * LocalContentProvider
 * フォトコンテンツ供給用 NativeBrdige クラス
 */
public class LocalContentProvider extends Gate {
    private static final String TAG = "[LocalContentProvider] ";

    // MediaStore への query で使用する
    private static final String DB_COLUMN_FILEPATH      = "_data";
    private static final String DB_COLUMN_ID            = "_id";
    private static final String DB_COLUMN_MIME_TYPE     = "mime_type";
    private static final String DB_COLUMN_MODIFIED_DATE = "date_modified";
    private static final String DB_COLUMN_SIZE          = "_size";
    private static final String DB_COLUMN_WIDTH         = "width";
    private static final String DB_COLUMN_HEIGHT        = "height";
    private static final String DB_COLUMN_ORIENTATION   = "orientation";
    private static final String DB_COLUMN_ADDED_DATE    = "date_added";
    private static final String DB_COLUMN_RECORDED_DATE = "datetaken";

    private static final Uri    DB_CONTENT_URI      = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
    private static final String DB_QUERY_SORT_ORDER = MediaStore.Images.Media.DATE_TAKEN + " DESC";

    // MediaStore に query する DB 列
    private static final String[] DB_QUERY_COLUMN_LIST = {
            DB_COLUMN_FILEPATH,
            DB_COLUMN_ID,
            DB_COLUMN_MIME_TYPE,
            DB_COLUMN_MODIFIED_DATE,
            DB_COLUMN_SIZE,
            DB_COLUMN_WIDTH,
            DB_COLUMN_HEIGHT,
            DB_COLUMN_ORIENTATION,
            DB_COLUMN_ADDED_DATE,
            DB_COLUMN_RECORDED_DATE,
    };

    // 圧縮フォーマット
//    private static final Bitmap.CompressFormat  IMAGE_COMPRESS_FORMAT   = Bitmap.CompressFormat.PNG;
//    private static final int                    IMAGE_COMPRESS_QUALITY  = 100;
//    private static final String                 IMAGE_COMPRESS_PREFIX   = "data:image/png;base64,";
    private static final Bitmap.CompressFormat  IMAGE_COMPRESS_FORMAT   = Bitmap.CompressFormat.JPEG;
    private static final int                    IMAGE_COMPRESS_QUALITY  = 90;
    private static final String                 IMAGE_COMPRESS_PREFIX   = "data:image/jpeg;base64,";

    ///////////////////////////////////////////////////////////////////////
    // public methods:

    /**
     * コンテンツ取得
     * Native Bridge I/F.
     *
     * @param index [in] 開始インデックス
     * @param limit [in] 1 query あたりの取得コンテンツ数の上限
     */
    @SuppressWarnings("unused")
    public void queryLocalContents(final double index, final double limit) {
        final MethodContext context = getContext();

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                Cursor cursor = null;
                try {
                    // キャンセル対象処理として登録
                    setCancelable(context);

                    JSONObject result = new JSONObject();
                    JSONArray contents = new JSONArray();

                    // Cursor 準備
                    cursor = openAllImages();

                    int totalContentCount = cursor.getCount();
                    final int MAX_QUERY_SIZE = (int)limit;

                    if (0 != totalContentCount && totalContentCount <= index) {
                        errorMsg = TAG + "Invalid index: " + String.valueOf(index) + "total count: " + String.valueOf(totalContentCount);
                        rejectParams(MessageUtils.ERROR_INVALID_ARG, errorMsg, context);
                        return;
                    }

                    cursor.moveToPosition((int)index);
                    int querySize = Math.min(MAX_QUERY_SIZE, totalContentCount - (int)index);
                    for (int i = 0; i < querySize; i++) {
                        if (isCanceled(context)) {
                            break;
                        }
                        contents.put(getContentInfo(cursor, (int)index + i));
                        cursor.moveToNext();
                    }

                    if (isCanceled(context)) {
                        errorMsg = TAG + "queryLocalContents() is canceled.";
                        rejectParams(MessageUtils.ERROR_CANCEL, errorMsg, context);
                    } else {
                        result.put("totalContentCount", totalContentCount);
                        result.put("contents", contents);
                        resolveParams(context, result);
                    }
                } catch (final SQLiteException e) {
                    errorMsg = "SQLiteException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (JSONException e) {
                    errorMsg = "JSONException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (SecurityException e){
                    // NOTE: Android 6.0 以降、Storage アクセスの許可を求めるには特別な方法が必要
                    //      http://it-challe.com/android-6-mkdir-not-working/
                    // 現状, JavsScript Layer から cordova-cordova-plugin-file のインフラで解決を行っている.
                    errorMsg = "SecurityException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (Exception e){
                    errorMsg = "Exception: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } finally {
                    if (null != cursor) {
                        cursor.close();
                    }
                    // キャンセル対象から登録解除
                    removeCancelable(context);
                }
            }
        });
    }

    /**
     * サムネイル取得
     * Native Bridge I/F.
     *
     * @param key [in] コンテンツキー
     */
    @SuppressWarnings("unused")
    public void queryThumbnailByKey(final String key) {
        final MethodContext context = getContext();

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                String base64;
                try {
                    // キャンセル対象処理として登録
                    setCancelable(context);

                    base64 = getThumbnailDataURL(context, key);
                    if (!isCanceled(context)) {
                        resolveParams(context, base64);
                    } else {
                        errorMsg = TAG + "queryThumbnailByKey() is canceled.";
                        rejectParams(MessageUtils.ERROR_CANCEL, errorMsg, context);
                    }
                } catch (final SQLiteException e) {
                    errorMsg = "SQLiteException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (IOException e) {
                    errorMsg = "IOException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (final IllegalArgumentException e) {
                    errorMsg = "IllegalArgumentException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (final IllegalStateException e) {
                    errorMsg = "IllegalStateException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, context);
                } finally {
                    // キャンセル対象から登録解除
                    removeCancelable(context);
                }
            }
        });
    }

    /**
     * Image Source 取得
     * Native Bridge I/F.
     *
     * @param key [in] コンテンツキー
     */
    @SuppressWarnings("unused")
    public void queryImageSourceByKey(final String key) {
        final MethodContext context = getContext();

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                String base64;
                try {
                    // キャンセル対象処理として登録
                    setCancelable(context);

                    base64 = getImageDataURL(context, key);
                    if (!isCanceled(context)) {
                        resolveParams(context, base64);
                    } else {
                        errorMsg = TAG + "queryImageSourceByKey() is canceled.";
                        rejectParams(MessageUtils.ERROR_CANCEL, errorMsg, context);
                    }
                } catch (final SQLiteException e) {
                    errorMsg = "SQLiteException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (IOException e) {
                    errorMsg = "IOException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (final IllegalArgumentException e) {
                    errorMsg = "IllegalArgumentException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } catch (final IllegalStateException e) {
                    errorMsg = "IllegalStateException: " + e.getMessage();
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, TAG + errorMsg, context);
                } finally {
                    // キャンセル対象から登録解除
                    removeCancelable(context);
                }
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods:

    /**
     *  すべての画像を取得可能なカーソルオブジェクトを取得
     *
     * @return Cursor オブジェクト
     */
    private Cursor openAllImages() {
        final ContentResolver resolver = cordova.getActivity().getApplicationContext().getContentResolver();
        return resolver.query(DB_CONTENT_URI, DB_QUERY_COLUMN_LIST, null, null, DB_QUERY_SORT_ORDER);
    }

    /**
     *  ID 指定より 画像のプロパティを取得可能なカーソルオブジェクトを取得
     *
     * @param  key [in] ID の文字列
     * @return Cursor オブジェクト
     */
    private Cursor openImageByKey(String key) {
        return openImageByKey(key, cordova.getActivity().getApplicationContext().getContentResolver());
    }

    /**
     *  ID 指定より 画像のプロパティを取得可能なカーソルオブジェクトを取得
     *
     * @param  key       [in] ID の文字列
     * @param  resolver [in] ContentResolver のインスタンス
     * @return Cursor オブジェクト
     */
    private Cursor openImageByKey(String key, final ContentResolver resolver) throws IllegalArgumentException {
        Cursor cursor = resolver.query(
                DB_CONTENT_URI,
                DB_QUERY_COLUMN_LIST,
                DB_COLUMN_ID + "=?",
                new String[] {
                        key
                },
                DB_QUERY_SORT_ORDER
        );
        if (null == cursor) {
            throw new IllegalArgumentException("invalid key: " + key);
        }
        cursor.moveToFirst();
        return cursor;
    }

    /**
     * カーソルオブジェクトからコンテンツ情報を取得
     *
     * @param cursor [in] カーソルオブジェクト
     * @param index  [in] インデックス
     * @return JSONObject コンテンツ情報
     */
    private JSONObject getContentInfo(Cursor cursor, int index) throws JSONException {
        JSONObject content = new JSONObject();
        final long key          = cursor.getLong(cursor.getColumnIndexOrThrow(DB_COLUMN_ID));
        final long width        = cursor.getLong(cursor.getColumnIndexOrThrow(DB_COLUMN_WIDTH));
        final long height       = cursor.getLong(cursor.getColumnIndexOrThrow(DB_COLUMN_HEIGHT));
        final long orientation  = cursor.getLong(cursor.getColumnIndexOrThrow(DB_COLUMN_ORIENTATION));

        content.put("key", String.valueOf(key));
        content.put("index", index);

        if (90 == orientation || 270 == orientation) {
            content.put("width", height);
            content.put("height", width);
        } else {
            content.put("width", width);
            content.put("height", height);
        }

        return content;
    }

    /**
     *  Key からサムネイル画像を生成
     */
    private String getThumbnailDataURL(final MethodContext context, final String key) throws IllegalArgumentException, IllegalStateException, IOException {
        final int id = Integer.parseInt(key);
        final ContentResolver resolver = cordova.getActivity().getContentResolver();

        String base64 = null;
        Cursor cursor = null;
        Bitmap thumbnailRaw = null;
        Bitmap thumbnail = null;

        try {
            cursor = openImageByKey(key, resolver);
            final long orientation  = cursor.getLong(cursor.getColumnIndexOrThrow(DB_COLUMN_ORIENTATION));

            if (!isCanceled(context)) {
                thumbnailRaw = MediaStore.Images.Thumbnails.getThumbnail(resolver, id, MediaStore.Images.Thumbnails.MICRO_KIND, null);
                if (null == thumbnailRaw) {
                    throw new IllegalArgumentException("thumbnail == empty");
                }
                Matrix matrix = new Matrix();
                matrix.postRotate(0);
                if (orientation > 0) {
                    matrix.postRotate(orientation);
                }

                thumbnail = Bitmap.createBitmap(
                        thumbnailRaw,
                        0, 0,
                        thumbnailRaw.getWidth(),
                        thumbnailRaw.getHeight(),
                        matrix, true
                );
            }

            if (!isCanceled(context)) {
                if (null == thumbnail) {
                    throw new IllegalStateException("thumbnail create failed.");
                }
                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                thumbnail.compress(IMAGE_COMPRESS_FORMAT, IMAGE_COMPRESS_QUALITY, stream);
                base64 = IMAGE_COMPRESS_PREFIX+ Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP);
                stream.close();
            }

        } finally {
            if (thumbnailRaw != null && !thumbnailRaw.isRecycled()) {
                thumbnailRaw.recycle();
            }
            if (thumbnail != null && !thumbnail.isRecycled()) {
                thumbnail.recycle();
            }
            if (null != cursor) {
                cursor.close();
            }
        }

        return base64;
    }

    /**
     *  Key から画像を生成
     *
     *  @param context [in] MethodContext インスタンスを指定
     *  @param key      [in] key を指定
     *  @return base64 data-url
     */
    private String getImageDataURL(final MethodContext context, final String key) throws IllegalArgumentException, IOException {
        String base64 = null;
        Cursor cursor = null;
        Bitmap imageRaw = null;
        Bitmap image = null;

        try {
            cursor = openImageByKey(key);
            final long orientation  = cursor.getLong(cursor.getColumnIndexOrThrow(DB_COLUMN_ORIENTATION));
            final String filePath  = cursor.getString(cursor.getColumnIndexOrThrow(DB_COLUMN_FILEPATH));

            if (!isCanceled(context)) {
                imageRaw = decodeBitmap(filePath);
                Matrix matrix = new Matrix();
                matrix.postRotate(0);
                if (orientation > 0) {
                    matrix.postRotate(orientation);
                }

                image = Bitmap.createBitmap(
                        imageRaw,
                        0, 0,
                        imageRaw.getWidth(),
                        imageRaw.getHeight(),
                        matrix, true
                );
            }

            if (!isCanceled(context)) {
                if (null == image) {
                    throw new IllegalStateException("thumbnail create failed.");
                }
                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                image.compress(IMAGE_COMPRESS_FORMAT, IMAGE_COMPRESS_QUALITY, stream);
                base64 = IMAGE_COMPRESS_PREFIX+ Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP);
                stream.close();
            }

        } finally {
            if (imageRaw != null && !imageRaw.isRecycled()) {
                imageRaw.recycle();
            }
            if (image != null && !image.isRecycled()) {
                image.recycle();
            }
            if (null != cursor) {
                cursor.close();
            }
        }

        return base64;
    }

    /**
     * 画像ファイルをdecodeする。
     *
     * @param filePath          画像ファイルのパス
     * @return                  decode後のBitmap
     *
     * @throws IllegalArgumentException    パラメーターが不正
     * @throws IllegalStateException        decodeに失敗した
     */
    private Bitmap decodeBitmap(final String filePath) throws IllegalArgumentException, IllegalStateException {
        final int MAX_IMAGE_LONG_SIDE_LENGTH = 1920;
        Bitmap bmpImage = null;
        Bitmap tmpBmp = null;
        try {
            if (filePath == null || filePath.isEmpty()) {
                throw new IllegalArgumentException("filePath == null || filePath.isEmpty()");
            }

            // 画像自体は読み込まず、画像サイズ情報のみを読み込む
            final BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(filePath, options);

            // 読み込むスケール（整数倍）を計算する
            final int scaleW = Math.round((float)options.outWidth / (float)MAX_IMAGE_LONG_SIDE_LENGTH);
            final int scaleH = Math.round((float)options.outHeight / (float)MAX_IMAGE_LONG_SIDE_LENGTH);
            final int scale = Math.max(scaleW, scaleH);
            options.inSampleSize = Math.max(scale, 1);

            // α/R/G/B 各8bit で読み込む
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            // 計算したスケールで画像を読み込む
            options.inJustDecodeBounds = false;
            tmpBmp = BitmapFactory.decodeFile(filePath, options);
            if (tmpBmp == null) {
                throw new IllegalStateException("BitmapFactory#decodeFile() failed. FILE: " + filePath);
            }
            bmpImage = tmpBmp.copy(Bitmap.Config.ARGB_8888, true);
        } finally {
            if (tmpBmp != null && !tmpBmp.isRecycled()) {
                tmpBmp.recycle();
            }
        }

        return bmpImage;
    }
}

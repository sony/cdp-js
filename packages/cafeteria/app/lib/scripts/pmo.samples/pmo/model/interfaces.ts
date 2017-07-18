import { IPromiseBase, IPromise } from "cdp/framework";
import { SlideShow } from "cdp.slideshow";

export module API {

    //#region Common data type

    export interface ItemIDsRequest {
        /** Comma separated content item ids. */
        item_ids: string;
    }

    export interface ListRequest {
        index?: number;
        limit?: number;
    }

    export interface SortableListRequest extends ListRequest {
        order_by?: string;
    }

    export interface GetItemRequest {
        thumb_keys?: string;
    }

    export interface GetItemsRequest extends SortableListRequest, GetItemRequest { }

    export interface RecipientIDsRequest {
        /** comma separated recipients email addresses. */
        recipients: string;
    }

    export interface LocalizationInfo {
        country?: string;
        language?: string;
    }

    export interface ResponseErrorItem {
        code?: number;
        message?: string;
    }
    export interface ResponseErrorInfo {
        error?: ResponseErrorItem[];
    }

    export module Metadata {

        export interface Device {
            make?: string;
            model?: string;
        }

        export interface GPS {
            altitude?: number;
            imgdirection?: number;
            imgdirectionref?: string;
            latitude?: number;
            longitude?: number;
            mapdatum?: string;
        }

        export interface Meta3d {
            cross_eyed_3d?: boolean;
            enable_3d?: boolean;
            format_type_3d?: string;
        }
    }

    export interface MetadataInfo {
        description?: string;
        device?: Metadata.Device;
        gps?: Metadata.GPS;
        image_orientation?: number;
        meta3d?: Metadata.Meta3d;
        modified_date?: string;
        orientation?: number;
        rating?: number;
        recorded_date?: string;
        thumbnail_orientation?: number;
        title?: string;
    }

    export interface ThumbnailInfo {
        height?: number;
        key?: string;
        location?: string;
        width?: number;
    }

    export interface ItemInfo {
        content_modified_date?: string;
        duration?: number;
        file_name?: string;
        file_size?: number;
        hash?: string;
        height?: number;
        is_3d?: boolean;
        is_original?: boolean;
        is_panoramic?: boolean;
        item_id?: string;
        item_web_url?: string;
        recorded_date?: string;
        meta_modified_date?: string;
        metadata?: MetadataInfo;
        mime_type?: string;
        modified_date?: string;
        owner_id?: string;
        score?: number;
        status?: string;
        status_flv?: string;
        status_mp4?: string;
        status_three_gp?: string;
        thumbnail?: ThumbnailInfo[];
        upload_url?: string;
        uploaded_date?: string;
        url_3gp_video?: string;
        url_flv_video?: string;
        url_mp4_video?: string;
        width?: number;
    }

    export interface UpdatedItemInfo extends ItemInfo {
        is_deleted?: boolean;
    }

    export interface TotalCountInfo {
        total_image_count?: number;
        total_video_count?: number;
        /** = total_image_count + total_video_count */
        total_item_count?: number;
    }

    export interface PackageInfo extends TotalCountInfo {
        created_date?: string;
        modified_date?: string;
        total_recipient_count?: number;
    }

    export interface ItemsInfo extends TotalCountInfo, ResponseErrorInfo {
        items?: ItemInfo[];
    }

    export interface QueryItemInfo extends ItemInfo, ResponseErrorInfo {
    }

    export interface UpdatedItemsInfo extends ResponseErrorInfo {
        total_updated_video_count?: number;
        total_updated_image_count?: number;
        updated_items?: UpdatedItemInfo[];
        total_updated_item_count?: number;
        last_updated_date?: string;
    }

    export interface UpdateItemIDs {
        deleted_item_ids?: string[];
        added_item_ids?: string[];
    }

    export interface UpdateItemIDsInfo extends UpdateItemIDs, ResponseErrorInfo {
    }

    export interface RecipientInfo {
        recipient_email?: string;
        first_name?: string;
        last_name?: string;
        user_id?: string;
    }

    export interface RecipientsInfo {
        recipients?: RecipientInfo[];
        total_recipient_count?: number;
    }

    //#endregion Common data type

    /**
     * Albums
     */
    export module Albums {

        //#region Albums request data
        export interface CreateAlbumRequest {
            /** Album name. max length: 512 characters. */
            album_name: string;
            /** Description. "" means clear description. max length: 1024 characters. */
            description?: string;
            /** Comma separated content item ids. */
            item_ids?: string;
        }

        export interface DeleteAlbumRequest {
            /**
             * true : When the album are deleted, the items on the album are deleted.
             * false : The items on the album are not deleted. (default)
             */
            delete_items?: boolean;
        }

        export interface UpdateAlbumInfoRequest {
            /** Album name. max length: 512 characters. */
            album_name?: string;
            /** Description. "" means clear description. max length: 1024 characters. */
            description?: string;
        }

        export interface RemoveItemsRequest extends ItemIDsRequest { }

        export interface GetAlbumItemsRequest extends GetItemsRequest { }

        export interface AddItemsRequest extends ItemIDsRequest { }

        export interface GetRecipientsRequest extends ListRequest { }

        export interface RemoveRecipientsRequest extends RecipientIDsRequest { }

        export interface AddRecipientsRequest extends RecipientIDsRequest { }

        export interface UpdateRecipientsRequest extends RecipientIDsRequest { }

        export interface GetItemsByDateRequest extends GetItemsRequest {
            date: string;
        }

        export interface GetItemsByDeviceRequest extends GetItemsRequest {
            device_id: string;
        }
        export interface GetSharedAlbumsRequest extends SortableListRequest { }

        export interface GetLastImportItemsRequest extends GetItemsRequest { }

        export interface GetAlbumsRequest extends SortableListRequest { }

        export interface GetRecentItemsRequest extends GetItemsRequest { }

        //#endregion Albums request data

        //#region Albums response data

        export interface DeleteAlbumID {
            deleted_album_id?: string;
        }

        export interface DeleteAlbumIDInfo extends DeleteAlbumID, ResponseErrorInfo {
        }

        export interface AlbumInfo extends PackageInfo, ResponseErrorInfo {
            shared_date?: string;
            album_id?: string;
            album_name?: string;
            description?: string;
            album_web_url?: string;
            owner_id?: string;
        }

        export interface AlbumItems extends ItemsInfo { }

        export interface UpdateRecipientIDs {
            added_recipients?: string[];
            deleted_recipients?: string[];
        }

        export interface UpdateRecipientIDsInfo extends UpdateRecipientIDs, ResponseErrorInfo {
        }

        export interface UpdateItemsInfo extends AlbumItems {
            contents_updated_items?: string[];
            last_updated?: string;
            meta_updated_items?: string[];
        }

        export interface AlbumsInfo extends ResponseErrorInfo {
            total_user_album_count?: number;
            albums?: AlbumInfo[];
        }

        export interface CreateAlbumInfo extends ResponseErrorInfo {
            album_id: string;
            album_web_url: string;
        }

        //#endregion Albums response data
    }

    /**
     * Application
     */
    export module Application {

    }

    /**
     * Auth
     */
    export module Auth {

        // Auth request data

        export interface AffiliationRequest {
                /** base64 encoded token */ affiliation_token: string;
        }

        export interface GetAffiliationAccountsRequest extends AffiliationRequest { }

        export interface GetAffiliationActivationCodeRequest extends AffiliationRequest {
            user_token: string;
        }

        export interface LoginByPinRequest extends GetAffiliationAccountsRequest {
            pin: string;
            signin_id: string;
        }

        export interface GetAuthSessionRequest {
            oauth_consumer_key: string;
            oauth_token: string;
            oauth_signature_method: string;
            oauth_signature: string;
            oauth_timestamp: string;
            oauth_nonce: string;
            oauth_version: string;
        }

        // Auth response data

        export interface Accounts extends ResponseErrorInfo {
                /** account (email address) list */ accounts?: string[];
        }

        export interface ActivationInfo {
                /** Activation code */ activation_code?: string;
        }

        export interface TokenInfo extends ResponseErrorInfo {
                /** Access token        */ access_token?: string;
                /** user email address  */ email?: string;
                /** Expire time (sec)   */ expires_in?: number;
                /** token type          */ token_type?: string;
        }

        export interface SessionInfo {
            session_id?: string;
        }
    }

    /**
     * Oauth2
     */
    export module Oauth2 {

        export interface GetRedirectUrlRequest {
            app?: string;
            cntry?: string;
            lang?: string;
            redirect_url?: string;
        }

        export interface GetTokenInfoRequest {
            url: string;
            redirect_uri: string;
            code: string;
            gid: string;
        }

        export interface RedirectInfo {
            location?: string;
        }
    }

    /**
     * Digest
     */
    export module Digest {

        // Request

        export interface DateRequest {
            /**
             * true : include the item information
             * false : Not include the item information (default)
             */
            detail?: boolean;
            /**
             * get digest information until specified date time
             * e.g 2012-11(yyyy-MM), 2012-11-01(yyyy-MM-dd)
             */
            until?: string;
            /**
             * number of the item for each digest (default: 10)
             * maximum limit is 100
             */
            digest_item_count?: number;
            /**
             * number of the digest information (default: 10)
             * maximum is 100, if specified "detail=true", Maximum limit is 10.
             */
            digest_count?: number;
            order_by?: string;
        }

        // Response

        export interface DigestInfo extends TotalCountInfo {
            digest_id?: string;
            digest_item_count?: number;
            /** digest item list (outputs if specified detail=true) */
            digest_items?: ItemInfo[];
        }
        export interface Digests extends ResponseErrorInfo {
                /** digest list */ digests?: DigestInfo[];
        }
    }

    /**
     * Items
     */
    export module Items {

        // Items request data

        export interface RemoveItemsRequest extends ItemIDsRequest { }

        export interface GetAllItemsRequest extends GetItemsRequest { }

        export interface UpdateMetadataRequest {
            cross_eyed_3d?: boolean;
            description?: string;
            enable_3d?: boolean;
            format_type_3d?: string;
            make?: string;
            model?: string;
            orientation?: number;
            rating?: number;
            recorded_date?: string;
            title?: string;
        }

        export interface AddItemRequest extends UpdateMetadataRequest {
            file_name: string;
            file_size: number;
            hash?: string;
            imgdirection?: number;
            imgdirectionref?: string;
            is_original?: boolean;
            latitude?: number;
            longitude?: number;
            mapdatum?: string;
            mime_type: string;
        }

        export interface GetPhotoItemsRequest extends GetItemsRequest { }

        export interface GetVideoItemsRequest extends GetItemsRequest { }

        export interface GetUpdatedItemsRequest extends ListRequest {
            updated_since?: string;
            updated_until?: string;
        }
    }

    /**
     * Postcards
     */
    export module Postcards {
        // Request
        export interface GeneratePostcardRequest extends RecipientIDsRequest, ItemIDsRequest {
            subject?: string;
            message?: string;
            postcard_theme_id: string;
        }

        export interface GetPostcardInfoRequest extends ListRequest { }

        export interface GetPostcardItemsRequest extends GetItemsRequest { }

        export interface GetRecipientsRequest extends ListRequest { }

        export interface GetInboxRequest extends SortableListRequest { }

        export interface GetOutboxRequest extends SortableListRequest { }

        // Response
        export interface PostcardInfo extends PackageInfo {
            postcard_id?: string;
            sender_id?: string;
            sender_email?: string;
            sender_first_name?: string;
            sender_last_name?: string;
            subject?: string;
            message?: string;
            postcard_web_url?: string;
        }

        export interface DeletePostcardID {
            deleted_postcard_id?: string;
        }

        export interface PostcardsInfo extends ResponseErrorInfo {
            total_postcard_count?: number;
            postcards: PostcardInfo[];
        }
    }

    /**
     * Recall
     */
    export module Recall {
        // Request
        export interface GetRecallItemsRequest extends GetItemRequest, LocalizationInfo {
            best_item_count: string;
            key_date: string;
        }

        // Response
        export interface RecallInfo extends ResponseErrorInfo {
            recall_type?: number;
            items?: ItemInfo[];
            recall_type_description?: string;
        }
    }

    /**
     * Theme
     */
    export module Theme {
        // Request
        export interface GetSlideshowMusicRequest {
            country: string;
            languages: string;
        }

        // Response
        export interface SlideshowMusicItemInfo {
            music_id: string;
            music_title: string;
            music_url: string;
        }
        export interface SlideshowMusicInfo {
            musics: SlideshowMusicItemInfo[];
        }

        export interface PostcardThemeItemInfo {
            preview_url: string;
            postcard_theme_name: string;
            background_url: string;
            postcard_theme_id: string;
        }

        export interface PostcardThemeInfo extends ResponseErrorInfo {
            postcard_theme: PostcardThemeItemInfo[];
        }
    }

    /**
     * Recommendation
     */
    export module Recommendation {
        // Request

        export interface GetCategoriesRequest extends LocalizationInfo { }

        export interface GetGroupsRequest extends LocalizationInfo { }

        export interface GetGroupContentsRequest extends ListRequest { }

        export interface GetGroupImagesReques extends ListRequest { }

        // Response
        export interface CategoryInfo {
            category_id?: string;
            category_name?: string;
        }

        export interface CategoriesInfo {
            categories?: CategoryInfo[];
            total_category_count?: number;
        }

        export interface ContentsCountInfo {
            total_video_content_count?: number;
            total_content_count?: number;
            total_image_content_count?: number;
        }

        export interface GroupInfo extends ContentsCountInfo {
            group_id?: string;
            group_name?: string;
        }

        export interface GroupsInfo {
            groups?: GroupInfo[];
            total_group_count?: number;
        }

        export interface ContentInfo {
            content_id?: string;
            description?: string;
            duration?: number;
            height?: string;
            mime_type?: string;
            owner_id?: string;
            recorded_date?: string;
            status?: string;
            title?: string;
            url_mp4_video?: string;
            width?: string;
        }

        export interface ContentsInfo extends ContentsCountInfo {
            contents?: ContentInfo[];
        }

        export interface OriginalGroupInfo {
            album_id?: string;
            postcard_id?: string;
            calendar_month?: string;
            group_type?: string;
        }

        export interface OriginalContentInfo {
            item_id?: string;
            postcard_id?: string;
                /** "item" or "postcard" */ content_type?: string;
        }
    }

    /**
     * SmartPhotobook
     */
    export module SmartPhotobook {

    }

    /**
     * User
     */
    export module User {

        export interface UserName {
            first_name?: string;
            last_name?: string;
        }

        export interface UserInfo extends UserName, ResponseErrorInfo {
            user_id?: string;
            country?: string;
            language?: string;
            used_space?: number;
            max_storage?: number;
            account_type?: string;
            account_status?: string;
            email?: string;
            avatar_update_date?: string;
        }
    }
}

export module ContentProvider {

    /**
     * @interface IProvider
     * @brief     ContentProvider の共通 I/F 定義
     */
    export interface IProvider extends Backbone.Events {
        /**
         * 管理下の query をすべてキャンセル
         * 停止完了を知る必要がある場合、jQueryPromise オブジェクトの発火を待つこと
         * cancel() はキャンセル不可
         *
         * @return done()
         */
        cancel(): IPromiseBase<any>;

        /**
         * 管理対象のキャッシュをクリア
         * 処理中である場合はキャンセルが実行される
         * 処理完了を知る必要がある場合、jQueryPromise オブジェクトの発火を待つこと
         * clear() はキャンセル不可
         *
         * @return done()
         */
        clear(): IPromiseBase<any>;

        /**
         * 一度に query するサイズ
         * 固定値. 最大: 100
         *
         * @return {Number} サイズ
         */
        querySize: number;
    }


    //___________________________________________________________________________________________________________________//

    /**
     * @interface TopContent
     * @brief     Dashboard に表示するコンテンツ情報
     *            url はそのまま使用可能
     */
    export interface TopContent {
        hasContents: boolean;    //!< 既定画像を使用しているか判定
        url: string;            //!< 画像の URL
    }

    /**
     * @interface IDashboardProvider
     * @brief     Dashboard 用 ContentProvider
     */
    export interface IDashboardProvider
        extends IProvider {
        /**
         * データ取得 (RecallPlayback)
         *
         * @return {DataProvider.Promise} done(data: Model.ItemList)
         */
        queryRecallPlaybackData(): IPromise<API.Recall.RecallInfo>;

        /**
         * Top Contents の取得
         *
         * @return {DataProvider.Promise} done(data: TopContent[])
         */
        queryTopContents(): IPromise<ContentProvider.TopContent[]>;
    }
}

//___________________________________________________________________________________________________________________//


export module MediaProvider {

    ///////////////////////////////////////////////////////////////////////
    // Interface options

    /**
     * @interface Options
     * @brief Options インターフェイス
     */
    export interface Options {
        size: string;                //!< 画像の長辺サイズ
        orientation?: number;        //!< Exif Orientation code [1-8]
        item?: API.ItemInfo;
        // TBD. framing 用情報とか
    }

    /**
     * @interface Key
     * @brief Key インターフェイス
     */
    export interface Key {
        key: string;
        info: Options;
    }

    /**
     * @interface MediaInfo
     * @brief MediaInfo インターフェイス
     */
    export interface MediaInfo {
        src: string;
        info?: any; // TBD. framing 用情報とか、回転情報とか
    }

    /**
     * @interface Query options
     *
     */
    export interface IOptions {
        // Reserve data
        reserve?: any;
    }

    ///////////////////////////////////////////////////////////////////////
    // Interface class

    /**
     * @interface IProvider
     * @brief     MediaProvider の I/F 定義
     */
    export interface IProvider {
        /**
         * Media の取得
         *
         * @param key {String} [in] key を入力
         * @param options? {DataProvider.IOptions}   [in] DataProvider オプション
         * @return {jQueryPromise} done(src: string, media: MediaInfo), src と MediaInfo インターフェイス形式
         */
        get(key: Key, options?: IOptions): IPromise<any>;

        /**
         * 管理下の get をすべてキャンセル
         * 停止完了を知る必要がある場合、jQueryPromise オブジェクトの発火を待つこと
         *
         * @return done()
         */
        cancel(): IPromiseBase<any>;

        /**
         * 管理対象のキャッシュをクリア
         * 処理中である場合はキャンセルが実行される
         * 処理完了を知る必要がある場合、jQueryPromise オブジェクトの発火を待つこと
         * clear() はキャンセル不可
         *
         * @return done()
         */
        clear(): IPromiseBase<any>;

        /**
         * Property Accesser の生成
         *
         * @param detail {Object} [in] key を入力
         * @return {Function} Tools.PropertyAccesser インターフェイス形式
         */
        makePropertyAccesser(detail: (element: any) => Key): SlideShow.PropertyAccesser;
    }
}

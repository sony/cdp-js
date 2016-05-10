/* tslint:disable:max-line-length */

/**
 * @class ListViewConfig
 * @brief 開発時に使用する調整パラメータ格納クラス
 */
export module ListViewConfig {
    export let UNIT_COUNT = 5;                                                              //!< 汎用のUNIT単位
    export let LIMIT_ITEMINFO_LIST_IMAGE_COUNT = 1000;                                      //!< ItemInfoList 構築時に設定する画像最大値
    export let LIMIT_ITEMINFO_LIST_COUNT = LIMIT_ITEMINFO_LIST_IMAGE_COUNT / UNIT_COUNT;    //!< ItemInfoList長最大値
    export let LIMIT_ITEMGROUPINFO_LIST_COUNT = 5;                                          //!< ItemGroupInfoList 構築時に設定するサブリスト最大値
    export let LIMIT_ITEMGROUPINFO_IMAGE_COUNT = 40;                                        //!< ItemGroupInfo が持つ画像最大値
    export let COLLAPSE_DELAY_TIME = 400;                                                   //!< Sub Group 収束時の遅延時間
}

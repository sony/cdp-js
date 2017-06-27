declare namespace CDP.UI {
    /**
     * @interface IListView
     * @brief ListView のインターフェイス
     */
    export interface IListView {
        //! 登録 framework が使用する
        _addLine?(_line: LineProfile, insertTo?: number): void;
        _addLine?(_line: LineProfile[], insertTo?: number): void;
    }
}

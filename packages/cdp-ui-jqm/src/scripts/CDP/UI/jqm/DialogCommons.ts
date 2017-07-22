/* tslint:disable:max-line-length */

namespace CDP.UI {

    const TAG = "[CDP.UI.DialogCommons] ";

    /**
     * Alert
     * alert メッセージ表示
     *
     * @param {String} message   [in] 表示文字列
     * @param {String} [options] [in] ダイアログオプション
     * @return {jQuery} ダイアログの DOM オブジェクト
     */
    export function alert(message: string, options?: DialogOptions): JQuery {
        const template = `
            <script type="text/template">
                <section class="ui-modal" data-role="popup" data-corners="false">
                    <div class="ui-content">
                        <h1 class="ui-title {{_titleState}}">{{title}}</h1>
                        <p class="ui-message">{{message}}</p>
                    </div>
                    <div class="ui-modal-footer ui-grid-solo">
                        <button id="{{idPositive}}" class="ui-btn ui-block-a ui-text-emphasis" data-auto-close="true">{{labelPositive}}</button>
                    </div>
                </section>
            </script>
        `;

        const dlgAlert = new Dialog(template, $.extend({}, {
            src: null,
            message: message,
        }, options));

        return dlgAlert.show();
    }

    /**
     * Confirm
     * 確認メッセージ表示
     *
     * @param {String} message   [in] 表示文字列
     * @param {String} [options] [in] ダイアログオプション
     * @return {jQuery} ダイアログの DOM オブジェクト
     */
    export function confirm(message: string, options?: DialogOptions): JQuery {
        const template = `
            <script type="text/template">
                <section class="ui-modal" data-role="popup" data-corners="false">
                    <div class="ui-content">
                        <h1 class="ui-title {{_titleState}}">{{title}}</h1>
                        <p class="ui-message">{{message}}</p>
                    </div>
                    <div class="ui-modal-footer ui-grid-a">
                        <button id="{{idNegative}}" class="ui-btn ui-block-a" data-auto-close="true">{{labelNegative}}</button>
                        <button id="{{idPositive}}" class="ui-btn ui-block-b ui-text-emphasis" data-auto-close="true">{{labelPositive}}</button>
                    </div>
                </section>
            </script>
        `;

        const dlgConfirm = new Dialog(template, $.extend({}, {
            src: null,
            message: message,
        }, options));

        return dlgConfirm.show();
    }

    /**
     * @interface DialogCommonsOptions
     * @brief prompt のオプション
     */
    export interface DialogPromptOptions extends DialogOptions {
        eventOK?: string; //!< OK ボタン押下時の event: default: promptok
    }

    /**
     * @class DialogPrompt
     * @brief prompt ダイアログ (非公開)
     */
    class DialogPrompt extends Dialog {

        private _eventOK: string;

        /**
         * constructor
         *
         */
        constructor(id: string, options?: DialogPromptOptions) {
            super(id, options);
            this._eventOK = options.eventOK || "promptok";
        }

        //! ダイアログ表示の直前
        protected onBeforeShow(): IPromiseBase<void> {
            const onCommit = (event: JQuery.Event) => {
                const text = this.$el.find("#_ui-prompt").val();
                this.$el.trigger(this._eventOK, text);
                this.close();
                event.preventDefault();
            };

            this.$el
                .on("vclick", ".command-prompt-ok ", (event: JQuery.Event) => {
                    onCommit(event);
                })
                .on("keydown", "#_ui-prompt", (event: JQuery.Event) => {
                    const ENTER_KEY_CODE = 13;
                    if (ENTER_KEY_CODE === event.keyCode) {
                        onCommit(event);
                    }
                });

            return super.onBeforeShow();
        }
    }

    /**
     * Prompt
     *
     * @param {String} message   [in] 表示文字列
     * @param {String} [options] [in] ダイアログオプション
     * @return {jQuery} ダイアログの DOM オブジェクト
     */
    export function prompt(message: string, options?: DialogPromptOptions): JQuery {
        const template = `
            <script type="text/template">
                <section class="ui-modal" data-role="popup" data-corners="false">
                    <div class="ui-content">
                        <h1 class="ui-title {{_titleState}}">{{title}}</h1>
                        <p class="ui-message">{{message}}</p>
                        <label for="_ui-prompt" class="ui-hidden-accessible"></label>
                        <input type="text" name="_ui-prompt" id="_ui-prompt">
                    </div>
                    <div class="ui-modal-footer ui-grid-a">
                        <button id="{{idNegative}}" class="ui-btn ui-block-a" data-auto-close="true">{{labelNegative}}</button>
                        <button id="{{idPositive}}" class="command-prompt-ok ui-btn ui-block-b ui-text-emphasis" data-auto-close="false">{{labelPositive}}</button>
                    </div>
                </section>
            </script>
        `;

        const dlgPrompt = new DialogPrompt(template, $.extend({}, {
            src: null,
            message: message,
        }, options));

        return dlgPrompt.show();
    }
}

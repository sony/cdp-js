namespace CDP.UI.Extension {

    //! iScroll.click patch
    const patch_IScroll_utils_click = function (event: Event): void {
        const target: any = event.target;
        const e: any = event;
        let ev: MouseEvent;

        // [CDP modified]: set target.clientX.
        if (null == target.clientX || null == target.clientY) {
            if (null != e.pageX && null != e.pageY) {
                target.clientX = e.pageX;
                target.clientY = e.pageY;
            } else if (e.changedTouches && e.changedTouches[0]) {
                target.clientX = e.changedTouches[0].pageX;
                target.clientY = e.changedTouches[0].pageY;
            }
        }

        if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
            ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, true, e.view, 1,
                target.screenX, target.screenY, target.clientX, target.clientY,
                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                0, null);

            (<any>ev)._constructed = true;
            target.dispatchEvent(ev);
        }
    };

    let s_applied = false;

    /**
     * iScroll Patch 拡張
     *
     * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
     * @param {DomExtensionOptions} [options] [in] オプション
     */
    function applyPatch($ui: JQuery, options?: DomExtensionOptions): JQuery {
        if (!s_applied && global.IScroll && global.IScroll.utils) {
            global.IScroll.utils.click = patch_IScroll_utils_click;
            s_applied = true;
        }
        return $ui;
    }

    // 登録
    ExtensionManager.registerDomExtension(applyPatch);
}

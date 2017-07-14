/* tslint:disable:max-line-length */

import * as $ from "jquery";

//! SmoothScroll internal profile interface.
interface Profile {
    scrollMapSize: number;
    elementWidth: number;
    pageNum: number;
    pageElementNum: number;
    pageSize: number;
    ensureBase: number;
    lastEnsureVisbleElementIndex: number;
}

/**
 * @class SmoothScroll
 * @brief Provide smooth page scroll function.
 *        NOTE: current version supported 'horizontal' only.
 */
export default class SmoothScroll {
    private static _defaultOptions = {
        orientation: "horizontal",
        elementClass: "cdp-smooth-page-element",
        focusClass: null,
        preloadCount: 1,            // {Number} number of preload page count.
        scrollSpeed: 250,
        ensureBaseRacio: 0.25,
        ensureVisibleOnResize: true,
        onSetElement: null,
        onClickElement: null,        // onClickElement(index, $element)
        onTouchStartElement: null,    // onTouchStart(index, $element), for mobile device event bind.
        onTouchEndElement: null,    // onTouchEnd(index, $element), for mobile device event bind.
        onScrollEnd: null,            // onScrollEnd(scrollTop, scrollLeft)
    };

    private static PAGE_CLASS_NAME = "cdp-smooth-page";
    private static PAGE_CLASS_SELECTOR = ".cdp-smooth-page";
    private static DATA_PAGE_READY = "data-page-ready";
    private static DATA_PAGE_INDEX = "data-page-index";
    private static DATA_ELEMENT_INDEX = "data-element-index";
    private static DATA_ELEMENT_READY = "data-element-ready";

    private _settings: any = null;
    private _$container: JQuery = null;
    private _resizeTimerId: number = 0;
    private _hiddenTimerId: number = 0;
    private _profile: Profile = null;
    private _inPaging: boolean = false;

    /**
     * init
     * Lazy construction method.
     *
     * @param {String} container id.
     * @param {Number} element max count.
     * @param {Object} options Option object.
     */
    init(containerId: string, count: number, options?: any): boolean {
        if (!containerId || !count || count <= 0) {
            console.log("error. invalid arg");
            return false;
        }

        // setup settings
        this._settings = $.extend({}, SmoothScroll._defaultOptions, options);
        this._settings.containerId = containerId;
        this._settings.count = count;

        if ("horizontal" !== this._settings.orientation) {
            console.log("error. unsupported orientation. orientation: " + this._settings.orientation);
            return false;
        }

        if (this._$container) {
            this._$container.children().remove();
        }

        $(window).resize(() => {
            clearTimeout(this._resizeTimerId);
            this._resizeTimerId = setTimeout(() => {
                const oldIndex = this._profile.lastEnsureVisbleElementIndex;
                this.clearPage();
                this.setupPage();
                if (!!this._settings.ensureVisibleOnResize) {
                    this.setPageVisibility(oldIndex);
                }
            }, 200);
        });

        this.prepareElements();
        return this.setupPage();
    }

    /**
     * valid
     * Validate this SmoothScroll object
     *
     */
    valid(): boolean {
        return !!this._$container;
    }

    /**
     * page next with animation.
     * NOTE: current version supported "horizontal" only.
     *
     */
    pageNext(): void {
        if (!this.valid()) {
            console.log("error. not to be initialized.");
            return;
        }
        const pos = this._$container.scrollLeft() + this._profile.pageSize;
        this.scroll(pos, true);
    }

    /**
     * page previous with animation.
     * NOTE: current version supported 'horizontal' only.
     *
     */
    pagePrevious(): void {
        if (!this.valid()) {
            console.log("error. not to be initialized.");
            return;
        }
        const pos = this._$container.scrollLeft() - this._profile.pageSize;
        this.scroll(pos, true);
    }

    /**
     * check page next enable.
     * NOTE: current version supported 'horizontal' only.
     *
     * @return true: can op / false: cannot.
     */
    canPageNext(): boolean {
        if (!this.valid()) {
            return false;
        }
        const pos = this._$container.scrollLeft() + $(window).width();
        if (this._profile.scrollMapSize <= $(window).width() || this._profile.scrollMapSize <= pos) {
            return false;
        }
        return true;
    }

    /**
     * check page previous enable.
     * NOTE: current version supported 'horizontal' only.
     *
     * @return true: can op / false: cannot.
     */
    canPagePrevious(): boolean {
        if (!this.valid()) {
            return false;
        }
        const pos = this._$container.scrollLeft();
        if (0 === pos) {
            return false;
        }
        return true;
    }

    /**
     * get element count.
     *
     * @return {Number} number of elements.
     */
    getElementCount(): number {
        if (!this.valid()) {
            return 0;
        }
        return this._settings.count;
    }

    /**
     * get element by index.
     *
     * @param  {Number} index.
     * @return {Object} jQuery object.
     */
    getElement(index: number): JQuery {
        if (!this.valid()) {
            return null;
        }
        if (index < 0 || this._settings.count <= index) {
            console.log("error. invalid index. : " + index);
            return null;
        }
        return this._$container.find("div[" + SmoothScroll.DATA_ELEMENT_INDEX + "='" + index + "']");
    }

    /**
     * set focus class.
     * enable if set focusClass in init method.
     *
     * @param  {Number} index.
     * @param  {boolean} index.
     */
    setFocus(index: number, exclusive: boolean = true): void {
        if (!this.valid() || !this._settings.focusClass) {
            return;
        }
        if (exclusive) {
            this._$container.find("." + this._settings.elementClass).removeClass(this._settings.focusClass);
        }
        this.getElement(index).addClass(this._settings.focusClass);
    }

    /**
     * ensure visibility index element.
     * NOTE: current version supported 'horizontal' only.
     *
     * @param  {Number} index.
     */
    ensureVisible(index: number): void {
        if (!this.valid()) {
            return;
        }
        if (index < 0 || this._settings.count <= index) {
            console.log("error. invalid index. : " + index);
            return null;
        }

        const absPos = this._profile.elementWidth * index;
        const scrollPos = absPos - this._profile.ensureBase;
        this.scroll(scrollPos, false, index);
    }

    /**
     * notify element setup status.
     *
     * @param  {Number} index.
     */
    setElementStatus(index: number, succeeded: boolean): void {
        if (!this.valid()) {
            return;
        }

        const $element = this._$container.find("div[" + SmoothScroll.DATA_ELEMENT_INDEX + "='" + index + "']");
        if (succeeded) {
            $element.attr(SmoothScroll.DATA_ELEMENT_READY, "true");
        } else {
            $element.parent().attr(SmoothScroll.DATA_PAGE_READY, "false");
        }
    }

    /**
     * set settings for update, after init() called.
     *
     * @param {Object} options Option object.
     */
    setSettings(options: any): void {
        this._settings = $.extend({}, this._settings, options);
    }

    /**
     * prepare all elements.
     * NOTE: current version supported 'horizontal' only.
     *
     * @private
     */
    private prepareElements(): void {
        this._$container = $("#" + this._settings.containerId);
        for (let i = 0; i < this._settings.count; i++) {
            this._$container.append(this.createElement(this._settings.elementClass, i));
        }

        this._$container.scroll((event) => {
            if (!this._inPaging) {
                this.setPageVisibilityByPosition(this._$container.scrollLeft());
                if (typeof this._settings.onScrollEnd === "function") {
                    this._settings.onScrollEnd(this._$container.scrollTop(), this._$container.scrollLeft());
                }
            }
        });
    }

    /**
     * create elements.
     *
     * @private
     */
    private createElement(className: string, index: number): JQuery {
        const element = `<div class='${className}' ${SmoothScroll.DATA_ELEMENT_INDEX}='${index}' ${SmoothScroll.DATA_ELEMENT_READY}='false'></div>`;
        const $element = $(element);

        if (typeof this._settings.onClickElement === "function") {
            $element.on("click", () => {
                this._settings.onClickElement(index, $element);
            });
        }
        if (typeof this._settings.onTouchStartElement === "function") {
            $element.on("touchstart MSPointerDown", () => {
                this._settings.onTouchStartElement(index, $element);
            });
        }
        if (typeof this._settings.onTouchEndElement === "function") {
            $element.on("touchend MSPointerUp", () => {
                this._settings.onTouchEndElement(index, $element);
            });
        }

        return $element;
    }

    /**
     * create page.
     *
     * @private
     */
    private createPage(index: number): JQuery {
        const page = `<div class='${SmoothScroll.PAGE_CLASS_NAME}' ${SmoothScroll.DATA_PAGE_INDEX}='${index}' ${SmoothScroll.DATA_PAGE_READY}='false'></div>`;
        const $page = $(page);

        const cssProperties = {
            overflow: "hidden",
            whiteSpace: "nowrap",
            display: "inline-block",
            visibility: "hidden",
        };

        $page.css(cssProperties);

        return $page;
    }

    /**
     * clear page div.
     *
     * @private
     */
    private clearPage(): void {
        const $pages = this._$container.find(SmoothScroll.PAGE_CLASS_SELECTOR);
        $pages.children().unwrap();
    }

    /**
     * setup page div.
     * NOTE: current version supported 'horizontal' only.
     *
     * @private
     */
    private setupPage(): boolean {
        const containerWidth = this._$container.parent().width() -
            (parseInt(this._$container.css("margin-left"), 10) + parseInt(this._$container.css("margin-right"), 10));
        const $elements = this._$container.find("." + this._settings.elementClass);
        const elementWidth = $elements.first().width() +
            parseInt($elements.first().css("margin-left"), 10) +
            parseInt($elements.first().css("margin-right"), 10) +
            parseInt($elements.first().css("padding-left"), 10) +
            parseInt($elements.first().css("padding-right"), 10) +
            parseInt($elements.first().css("border-left-width"), 10) +
            parseInt($elements.first().css("border-right-width"), 10)
            ;

        if (containerWidth <= 0 || elementWidth <= 0) {
            console.log("error. invalid width.");
            return false;
        }

        const elementsAllWidth = elementWidth * this._settings.count;
        let pageNum = Math.ceil(elementsAllWidth / containerWidth);
        const pageElementNum = Math.floor(containerWidth / elementWidth);

        // for round-off error.
        while (pageNum * pageElementNum < this._settings.count) {
            pageNum++;
        }

        let i = 0, start = 0, end = 0;
        for (i = 0; i < pageNum; i++) {
            start = i * pageElementNum;
            end = start + pageElementNum;
            if (this._settings.count < end) {
                end = this._settings.count;
            }
            const $target = $elements.slice(start, end);
            $target.wrapAll(this.createPage(i));
        }

        // cache profile.
        this._$container.width(containerWidth);
        this._profile = <Profile>{};
        this._profile.scrollMapSize = elementsAllWidth;
        this._profile.elementWidth = elementWidth;
        this._profile.pageNum = pageNum;
        this._profile.pageElementNum = pageElementNum;
        this._profile.pageSize = pageElementNum * elementWidth;
        this._profile.ensureBase = Math.floor(containerWidth * this._settings.ensureBaseRacio / elementWidth) * elementWidth;
        this._profile.lastEnsureVisbleElementIndex = 0;

        return true;
    }

    /**
     * scroll core logic.
     * NOTE: current version supported 'horizontal' only.
     *
     * @param {Number} scroll position.
     * @param {Boolean} true: animation / false : non animation.
     * @param {Number} element index if known.
     * @private
     */
    private scroll(pos: number, animation: boolean, index?: number): void {
        if (animation) {
            this.animateScroll(pos);
        } else {
            this._$container.scrollLeft(pos);
            if (typeof this._settings.onScrollEnd === "function") {
                this._settings.onScrollEnd(this._$container.scrollTop(), this._$container.scrollLeft());
            }
        }

        if (null != index) {
            this.setPageVisibility(index);
        } else {
            this.setPageVisibilityByPosition(pos);
        }
    }

    /**
     * animate scroll
     * NOTE: current version supported "horizontal" only.
     *
     * @param {Number} scroll position.
     * @private
     */
    private animateScroll(pos: number): void {
        this._inPaging = true;
        const complete = () => {
            this._inPaging = false;
            if (typeof this._settings.onScrollEnd === "function") {
                this._settings.onScrollEnd(this._$container.scrollTop(), this._$container.scrollLeft());
            }
        };

        this._$container.animate({ scrollLeft: pos }, {
            duration: this._settings.scrollSpeed,
            easing: "linear",
            complete: complete,
        });
    }

    /**
     * set page visibility.
     * prepare page data [prev|current|next].
     *
     * @param {Number} visible element index
     * @private
     */
    private setPageVisibility(elementIndex: number): void {
        if (elementIndex < 0) {
            elementIndex = 0;
        }

        const $currentPage = this._$container.find("div[" + SmoothScroll.DATA_ELEMENT_INDEX + "='" + elementIndex + "']").parent();
        const currentPageIndex = parseInt($currentPage.attr(SmoothScroll.DATA_PAGE_INDEX), 10);
        let $prevPage = null, $nextPage = null;
        let pageIndex = 0;
        let i = 0;

        this._profile.lastEnsureVisbleElementIndex = elementIndex;

        let hiddenIndexPrev = null, hiddenIndexNext = null;
        if (0 < currentPageIndex) {
            for (i = 0, pageIndex = currentPageIndex - 1; i < this._settings.preloadCount; i++ , pageIndex--) {
                if (pageIndex < 0) {
                    break;
                }
                hiddenIndexPrev = pageIndex;
                $prevPage = this._$container.find("div[" + SmoothScroll.DATA_PAGE_INDEX + "='" + pageIndex + "']");
                $prevPage.css("visibility", "visible");
                this.preparePageData($prevPage);
            }
        }

        $currentPage.css("visibility", "visible");
        this.preparePageData($currentPage);

        if (currentPageIndex < this._profile.pageNum - 1) {
            for (i = 0, pageIndex = currentPageIndex + 1; i < this._settings.preloadCount; i++ , pageIndex++) {
                if (this._profile.pageNum - 1 < pageIndex) {
                    break;
                }
                hiddenIndexNext = pageIndex + 1;
                $nextPage = this._$container.find("div[" + SmoothScroll.DATA_PAGE_INDEX + "='" + pageIndex + "']");
                $nextPage.css("visibility", "visible");
                this.preparePageData($nextPage);
            }
        }

        // hidden with post scroll end.
        if (typeof hiddenIndexPrev === "number" || typeof hiddenIndexNext === "number") {
            clearTimeout(this._hiddenTimerId);
            this._hiddenTimerId = setTimeout(() => {
                if (typeof hiddenIndexPrev === "number") {
                    this._$container.children().slice(0, hiddenIndexPrev).css("visibility", "hidden");
                }
                if (typeof hiddenIndexNext === "number") {
                    this._$container.children().slice(hiddenIndexNext, this._profile.pageNum).css("visibility", "hidden");
                }
            }, this._settings.scrollSpeed);
        }
    }

    /**
     * set page visibility by scroll position.
     * prepare page data [prev|current|next].
     *
     * @param {Number} scroll position
     * @private
     */
    private setPageVisibilityByPosition(pos: number): void {
        const elementIndex = Math.floor(pos / this._profile.elementWidth);
        this.setPageVisibility(elementIndex);
    }

    /**
     * prepare page data.
     *
     * @param {Number} visible element index
     * @private
     */
    private preparePageData($page: JQuery): void {
        const ready = $page.attr(SmoothScroll.DATA_PAGE_READY);
        if ("false" === ready && typeof this._settings.onSetElement === "function") {
            $page.attr(SmoothScroll.DATA_PAGE_READY, "true");
            const $target = $page.find("div[" + SmoothScroll.DATA_ELEMENT_READY + "='false']");
            $target.each((index, element) => {
                const globalIndex = parseInt($(element).attr(SmoothScroll.DATA_ELEMENT_INDEX), 10);
                this._settings.onSetElement(globalIndex, $(element));
            });
        }
    }
}

/* tslint:disable:max-line-length */

import "cdp.promise";
import { INVALID_INDEX } from "./constants";
import { PropertyAccesser, CursorArray } from "./cursor-array";

const TAG = "[CDP.Tools.InfinityContainer] ";

interface Container {
    container: CursorArray;
    start: number;
    end: number;
    dirty: boolean;
}

interface RangeResult {
    canSync: boolean;
    container: Container;
    localIndex: number;
    shift: string;
}

export interface IterateResult {
    succeeded: boolean;
    promise: JQueryPromise<any>;
    value: any;
}

export interface ContainerSetupperCallback {
    (newContainer: any[], accesser?: PropertyAccesser): void;
    (newContainer: CursorArray, accesser?: PropertyAccesser): void;
}

export interface ContainerSetupper {
    (start: number, end: number, callback: ContainerSetupperCallback): void;
}

/**
 * @class InfinityContainer
 * @brief Provide infinity container operation.
 *        implemented by ring buffer archtecture.
 */
export class InfinityContainer {
    private _globalIndex: number = INVALID_INDEX;
    private _prevData: Container = null;
    private _currentData: Container = null;
    private _nextData: Container = null;
    private _settings: any = null;
    private _prmsManager: CDP.PromiseManager = null;
    private _reservedSeek: any[] = [];

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * init
     * Lazy async construction method.
     *
     * @param {Object} firstContainer Array or First CursorArray object.
     * @param {Object} options Option object.
     */
    public init(firstContainer: any[], options?: any): CDP.IPromise<any>;
    public init(firstContainer: CursorArray, options?: any): CDP.IPromise<any>;
    public init(firstContainer: any, options?: any): CDP.IPromise<any> {
        let container = null;
        let accesser = null;

        const defaultOptions = {
            propAccesser: null,
            globalContainerMax: null,
            localContainerMax: null,
            setupContainer: null,
            repeat: false,
            firstContainerStart: 0,
            firstContainerEnd: null,    // always overwrite.
            firstContainerPosition: 0,
        };

        this.reset();

        if (firstContainer instanceof Array) {
            if (!!options && null != options.propAccesser) {
                accesser = options.propAccesser;
            }
            container = new CursorArray(firstContainer, accesser);
        } else if (firstContainer instanceof CursorArray) {
            container = firstContainer;
        }

        if (!container || !container.valid()) {
            console.error(TAG + "invalid firstContainer.");
            return <any>CDP.Promise.reject();
        }

        // setup settings
        this._settings = $.extend({}, defaultOptions, options);

        if (!this._settings.globalContainerMax) {
            this._settings.globalContainerMax = container.size();
        }
        if (!this._settings.localContainerMax) {
            this._settings.localContainerMax = container.size();
        }

        this._settings.firstContainerEnd = this._settings.firstContainerStart + container.size() - 1;

        this._currentData = {
            container: container,
            start: this._settings.firstContainerStart,
            end: this._settings.firstContainerEnd,
            dirty: false,
        };
        this._globalIndex = this._settings.firstContainerPosition;

        return this.manageState(this.prepareReservedContainers());
    }

    /**
     * valid
     * Validate this InfinityContainer object
     *
     */
    public valid(): boolean {
        if (this.validContainer(this._currentData, true)) {
            if (this._currentData.start <= this._globalIndex &&
                this._globalIndex <= this._currentData.end
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * isInAsyncProc
     * Check async condition method.
     *
     */
    public isInAsyncProc(): boolean {
        if (0 < this._prmsManager.promises().length) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * waitAsyncProc
     * Wait async condition.
     *
     */
    public waitAsyncProc(): JQueryPromise<any> {
        const df = $.Deferred();

        const check = () => {
            const promises = this._prmsManager.promises();
            if (0 < promises.length) {
                CDP.wait(promises)
                    .always(() => {
                        setTimeout(check);
                    });
            } else {
                df.resolve();
            }
        };
        setTimeout(check);

        return df.promise();
    }

    /**
     * Check the object has async property accesser
     *
     * @return {Boolean} true: has / flase: doesn't have.
     */
    public hasAsyncAccesser(): boolean {
        if (!this.valid()) {
            return false;
        }
        return this._currentData.container.hasAsyncAccesser();
    }

    /**
     * get
     * Get value of container.
     * If the object cannot accsess available container by index, this method returns null.
     *
     * @param {Number} index, array index.
     * @return Container value of index position.
     */
    public get(index?: number): any {
        if (!this.validContainer(this._currentData, true)) {
            return null;
        }

        const accessIndex = (null != index) ? index : this._globalIndex;

        const range = this.checkIterateRange(accessIndex);
        if (range.canSync) {
            return range.container.container.seek(range.localIndex);
        } else {
            console.error(TAG + "cannot sync access, invalid range. index[current:set] = [" + this._globalIndex + ":" + accessIndex + "]");
            return null;
        }
    }

    /**
     * remove
     * Remove index element.
     * If the object cannot accsess available container by index, this method fails.
     *
     * @param @param {Number} index, array index.
     * @return {Boolean} true: succeeded / false: failed.
     */
    public remove(index?: number): boolean {
        if (!this.validContainer(this._currentData, true)) {
            return false;
        }

        const accessIndex = (null != index) ? index : this._globalIndex;

        const shift = (lhs: Container, rhs: Container) => {
            if (this.validContainer(lhs, true) &&
                this.validContainer(rhs, true) &&
                lhs.end < rhs.start
            ) {
                const element = rhs.container.getArray(true).shift();
                lhs.container.getArray(true).push(element);
                rhs.dirty = true;
                lhs.dirty = (lhs.container.size() !== this._settings.localContainerMax);
            } else {
                lhs.dirty = true;
            }
        };

        const ensure = () => {
            const check = (target: Container): boolean => {
                if (this.validContainer(target, true)) {
                    if (target.container.size() <= 0) {
                        return false;
                    }
                }
                return true;
            };
            if (!check(this._prevData)) {
                this._prevData = this.resetContainer();
            }
            if (!this.valid() || !check(this._currentData)) {
                this._currentData = this.resetContainer();
            }
            if (!check(this._nextData)) {
                this._nextData = this.resetContainer();
            }
        };

        const revise = (target: string) => {
            switch (target) {
                case "backward":    // _prevData
                    shift(this._prevData, this._currentData);
                    shift(this._currentData, this._nextData);
                    break;
                case "":            // _currentData
                    shift(this._currentData, this._nextData);
                    break;
                case "forward":        // _nextData
                    this._nextData.dirty = true;
                    break;
                default:
                    break;
            }

            ensure();

            if (!this.validContainer(this._currentData, true)) {
                this.manageState(this.requeryContainers(this._globalIndex));
            } else if (!this.validContainer(this._prevData) && !this.validContainer(this._nextData, true)) {
                this.manageState(this.prepareReservedContainers());
            } else if (!this.validContainer(this._prevData)) {
                this.manageState(this.prepareBackwardContainer());
            } else if (!this.validContainer(this._nextData, true)) {
                this.manageState(this.prepareForwardContainer());
            }
        };

        const updateRelatedContainer = (result: RangeResult) => {
            const hasReserved = this._currentData.start !== 0 || this._currentData.end !== this._settings.globalContainerMax;
            if (hasReserved) {
                revise(result.shift);
            } else {
                this._currentData.end--;
            }
        };

        const range = this.checkIterateRange(accessIndex);
        if (range.canSync) {
            if (range.container.container.remove(range.localIndex)) {
                this._settings.globalContainerMax--;
                if (this._settings.globalContainerMax <= this._globalIndex) {
                    this._globalIndex = this._settings.globalContainerMax - 1;
                }
                if (0 < this._settings.globalContainerMax) {
                    updateRelatedContainer(range);
                } else {
                    this._prevData = this.resetContainer();
                    this._currentData = this.resetContainer();
                    this._nextData = this.resetContainer();
                }
                return true;
            } else {
                return false;
            }
        } else {
            console.error(TAG + "cannot sync access, invalid range. index[current:set] = [" + this._globalIndex + ":" + accessIndex + "]");
            return false;
        }
    }

    /**
     * size
     * Get all container size.
     *
     */
    public size(): number {
        return this._settings.globalContainerMax;
    }

    /**
     * getIndex
     * Get all container index position value.
     *
     */
    public getIndex(): number {
        return this._globalIndex;
    }

    /**
     * getCurrentCursorArray
     * Get current raw CursorArray Object.
     *
     */
    public getCurrentCursorArray(): CursorArray {
        if (!this.valid()) {
            return null;
        }
        this._currentData.container.seek(this._globalIndex - this._currentData.start);
        return this._currentData.container;
    }

    /**
     * getCurrentArray
     * Get current raw Array Object.
     *
     */
    public getCurrentArray(): any[] {
        if (!this.valid()) {
            return null;
        }
        return this._currentData.container.getArray();
    }

    /**
     * setRepeat
     * Update repeat setting.
     *
     * @param {Boolean} enable, true:repeat, false:no repeat
     */
    public setRepeat(enable: boolean): void {
        this._settings.repeat = enable;
        if (this.validContainer(this._currentData) &&
            (!this.validContainer(this._prevData) || !this.validContainer(this._nextData))) {
            this.manageState(this.prepareReservedContainers());
        }
    }

    /**
     * isRepeatable
     * Check current repeat state.
     *
     * @return {Boolean} true: enbale/false: disable
     */
    public isRepeatable(): boolean {
        return this._settings.repeat;
    }

    /**
     * isFirst
     * Check index position of first.
     *
     * @param {Boolean} ignoreRepeat, always detect content if repeat set.
     */
    public isFirst(ignoreRepeat: boolean = false): boolean {
        const repeat = !ignoreRepeat && this._settings.repeat;
        if (!this.valid() || repeat) {
            return false;
        }
        return 0 === this._globalIndex;
    }

    /**
     * isLast
     * Check index position of last.
     *
     * @param {Boolean} ignoreRepeat, always detect content if repeat set.
     */
    public isLast(ignoreRepeat: boolean = false): boolean {
        const repeat = !ignoreRepeat && this._settings.repeat;
        if (!this.valid() || repeat) {
            return false;
        }
        return (this._settings.globalContainerMax - 1) === this._globalIndex;
    }

    /**
     * seek
     * Jamp to index position.
     *
     * @param {Number} index Target index.
     * @return IterateResult object.
     *      {
     *          succeeded   : bool;
     *          promise     : JQueryPromise<any>;
     *          value       : any;
     *      }
     */
    public seek(index: number): IterateResult {
        const df = $.Deferred();
        const result = { succeeded: false, promise: null, value: null };

        if (!this.validContainer(this._currentData, true) ||
            //                    this.isInAsyncProc()                            ||
            index < 0 ||
            this._settings.globalContainerMax - 1 < index
        ) {
            console.error(TAG + "invalid state.");
            result.promise = $.Deferred().reject();
            return result;
        }

        result.promise = df.promise();
        result.succeeded = true;

        const range = this.checkIterateRange(index);
        if (range.canSync && !range.container.dirty) {
            this._globalIndex = index;
            result.value = range.container.container.seek(range.localIndex);
            switch (range.shift) {
                case "backward":
                    this.manageState(this.shiftBackwardContainer());
                    break;
                case "forward":
                    this.manageState(this.shiftForwardContainer());
                    break;
                default:
                    break;
            }
            result.promise = df.resolve(index);
        } else {
            this._reservedSeek.push({ index: index, df: df });

            const proc = () => {
                this.waitAsyncProc()
                    .always(() => {
                        let target;

                        // gurd reentrance
                        if (this._reservedSeek.length <= 0) {
                            return;
                        }

                        target = this._reservedSeek.shift();

                        // case of sync access ready.
                        const rng = this.checkIterateRange(target.index);
                        if (rng.canSync && !rng.container.dirty) {
                            this._globalIndex = target.index;
                            switch (rng.shift) {
                                case "backward":
                                    this.manageState(this.shiftBackwardContainer());
                                    break;
                                case "forward":
                                    this.manageState(this.shiftForwardContainer());
                                    break;
                                default:
                                    break;
                            }
                            target.df.resolve(target.index);
                            if (0 < this._reservedSeek.length) {
                                setTimeout(proc, 0);
                            }
                            return;
                        } else {
                            // case of requery container.
                            this.manageState(this.requeryContainers(target.index))
                                .then(() => {
                                    this._globalIndex = target.index;
                                    target.df.resolve(target.index);
                                    if (0 < this._reservedSeek.length) {
                                        setTimeout(proc, 0);
                                    }
                                })
                                .fail(() => {
                                    console.error(TAG + "queryContainer(), failed.");
                                    target.df.reject(target.index);
                                    if (0 < this._reservedSeek.length) {
                                        setTimeout(proc, 0);
                                    }
                                });
                        }
                    });
            };

            // start sync call.
            proc();
        }

        return result;
    }

    /**
     * first
     * Jamp to first index position.
     *
     * @return IterateResult object.
     *      {
     *          succeeded   : bool;
     *          promise     : JQueryPromise<any>;
     *          value       : any;
     *      }
     */
    public first(): IterateResult {
        return this.seek(0);
    }

    /**
     * last
     * Jamp to last index position.
     *
     * @return IterateResult object.
     *      {
     *          succeeded   : bool;
     *          promise     : JQueryPromise<any>;
     *          value       : any;
     *      }
     */
    public last(): IterateResult {
        return this.seek(this._settings.globalContainerMax - 1);
    }

    /**
     * previous
     * Move cursor previous index.
     *
     * @return IterateResult object.
     *      {
     *          succeeded   : bool;
     *          promise     : JQueryPromise<any>;
     *          value       : any;
     *      }
     */
    public previous(): IterateResult {
        let nextIndex = this._globalIndex - 1;
        if (nextIndex < 0) {
            if (this._settings.repeat) {
                nextIndex = this._settings.globalContainerMax - 1;
            } else {
                return { succeeded: false, promise: $.Deferred().reject(), value: null };
            }
        }
        return this.seek(nextIndex);
    }

    /**
     * next
     * Move cursor next index.
     *
     * @return IterateResult object.
     *      {
     *          succeeded   : bool;
     *          promise     : JQueryPromise<any>;
     *          value       : any;
     *      }
     */
    public next(): IterateResult {
        let nextIndex = this._globalIndex + 1;
        if (this._settings.globalContainerMax <= nextIndex) {
            if (this._settings.repeat) {
                nextIndex = 0;
            } else {
                return { succeeded: false, promise: $.Deferred().reject(), value: null };
            }
        }
        return this.seek(nextIndex);
    }

    /**
     * updateSetupContainer
     * if in async proc, this method returns always fallse.
     *
     * @param  {Function} setupContainer functions.
     * @param  {Object}  property accesser function object.
     * @return {Boolean} true: succeeded / false: failed.
     */
    public updateSetupContainer(setupContainer: ContainerSetupper, accesser?: PropertyAccesser): boolean {
        if (!this.valid() || this.isInAsyncProc()) {
            return false;
        } else if (typeof setupContainer !== "function") {
            console.error(TAG + "invalid function type.");
            return false;
        }
        this._settings.setupContainer = setupContainer;

        if (!!accesser) {
            this.updateAccesser(this._prevData, accesser);
            this.updateAccesser(this._currentData, accesser);
            this.updateAccesser(this._nextData, accesser);
        }

        return true;
    }

    /**
     * clone
     * deep copy method including container members.
     *
     * @return {Boolean} true: succeeded / false: failed.
     */
    public clone(): InfinityContainer {
        if (!this.valid()) {
            return null;
        }

        const target: any = $.extend(true, {}, this);

        // deep copy for container stuff.
        target._prevData.container = $.extend(true, {}, this._prevData.container);
        target._currentData.container = $.extend(true, {}, this._currentData.container);
        target._nextData.container = $.extend(true, {}, this._nextData.container);

        return <InfinityContainer>target;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    /**
     * reset
     * Cleanup this class.
     *
     */
    private reset(): void {
        this._globalIndex = INVALID_INDEX;
        this._prevData = this.resetContainer();
        this._currentData = this.resetContainer();
        this._nextData = this.resetContainer();
        this._settings = null;
        this._prmsManager = new CDP.PromiseManager();
    }

    /**
     * resetContainer
     *
     * @return Create empty Container.
     */
    private resetContainer(): Container {
        return {
            container: null,
            start: INVALID_INDEX,
            end: INVALID_INDEX,
            dirty: false,
        };
    }

    /**
     * updateAccesser
     *
     * @param {Object} target Target Container object.
     * @param  {Object}  property accesser function object.
     * @return true:succeeded / false:failed.
     */
    private updateAccesser(target: Container, accesser: PropertyAccesser): boolean {
        if (!!target && !!target.container) {
            target.container.accesser = accesser;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Manage for async status.
     *
     */
    private manageState(df: JQueryDeferred<any>): CDP.IPromise<any> {
        return this._prmsManager.add(CDP.makePromise(df));
    }

    /**
     * validContainer
     * private method.
     *
     * @param {Object} target Target Container object.
     */
    private validContainer(target: Container, ignoreDirty: boolean = false): boolean {
        if (!!target && !!target.container &&
            INVALID_INDEX !== target.start &&
            INVALID_INDEX !== target.end &&
            target.start <= target.end
        ) {
            if (ignoreDirty) {
                return true;
            } else {
                return !target.dirty;
            }
        } else {
            return false;
        }
    }

    /**
     * queryContainer
     * private async method.
     *
     * @param {Object} target Target Container object.
     * @param {Number} index  Index of Container start/end index.
     * @param {String} direction If 'forward', index means start index, else means end index.
     */
    private queryContainer(target: Container, index: number, direction: string): JQueryDeferred<any> {
        const df = $.Deferred();
        let start = INVALID_INDEX;
        let end = INVALID_INDEX;
        const oldAccesser = (this._currentData.container) ? this._currentData.container.accesser : null;

        if (!!this._settings.setupContainer) {
            switch (direction) {
                case "backward":
                    start = Math.floor(index / this._settings.localContainerMax) * this._settings.localContainerMax;
                    end = index;
                    break;
                case "forward":
                    start = index;
                    end = index + this._settings.localContainerMax - 1;
                    break;
                default:
                    console.error(TAG + "invalid direction: " + direction);
                    return df.reject();
            }

            this._settings.setupContainer(start, end + 1 /* '+1':for slice() */, (newContainer, accesser) => {
                let container = null;
                if (newContainer instanceof Array) {
                    container = new CursorArray(newContainer, accesser ? accesser : oldAccesser);
                } else if (newContainer instanceof CursorArray) {
                    container = newContainer;
                }
                if (!container) {
                    console.error(TAG + "received container is null.");
                    return df.reject();
                }

                target.container = container;
                if ("forward" === direction) {
                    target.start = start;
                    target.end = start + container.size() - 1;
                } else {
                    target.start = end - (container.size() - 1);
                    // for fail safe
                    if (target.start < 0) {
                        console.warn(TAG + "target.start revised.");
                        target.start = 0;
                    }
                    target.end = end;
                }
                return df.resolve();
            });

        } else {
            console.error(TAG + "_settings.setupContainer is null.");
            return df.reject();
        }

        return df;
    }

    /**
     * prepareBackwardContainer
     * private async method.
     */
    private prepareBackwardContainer(): JQueryDeferred<any> {
        if (0 < this._currentData.start) {
            return this.queryContainer(this._prevData, this._currentData.start - 1, "backward");
        } else if (0 === this._currentData.start &&
            this._currentData.end < this._settings.globalContainerMax - 1 &&
            this._settings.repeat) {
            return this.queryContainer(this._prevData, this._settings.globalContainerMax - 1, "backward");
        } else {
            return $.Deferred().resolve();
        }
    }

    /**
     * prepareForwardContainer
     * private async method.
     */
    private prepareForwardContainer(): JQueryDeferred<any> {
        if (this._currentData.end < this._settings.globalContainerMax - 1) {
            return this.queryContainer(this._nextData, this._currentData.end + 1, "forward");
        } else if (this._currentData.end === this._settings.globalContainerMax - 1 &&
            0 < this._currentData.start &&
            this._settings.repeat) {
            return this.queryContainer(this._nextData, 0, "forward");
        } else {
            return $.Deferred().resolve();
        }
    }

    /**
     * prepareReservedContainers
     * private async method.
     *
     */
    private prepareReservedContainers(): JQueryDeferred<any> {
        const df = $.Deferred();
        const promises = [];

        if (!this.validContainer(this._currentData)) {
            console.error(TAG + "validContainer(_currentData), failed.");
            return df.reject();
        }

        // reset reserved container
        this._prevData = this.resetContainer();
        this._nextData = this.resetContainer();

        promises.push(this.prepareBackwardContainer());
        promises.push(this.prepareForwardContainer());

        $.when.apply(null, promises)
            .done(() => {
                df.resolve();
            })
            .fail(() => {
                console.error(TAG + "wait queryContainer(), failed.");
                df.reject();
            });

        return df;
    }

    /**
     * prepareBackwardContainer
     * private async method.
     */
    private requeryContainers(index: number): JQueryDeferred<any> {
        const df = $.Deferred();
        const start = Math.floor(index / this._settings.localContainerMax) * this._settings.localContainerMax;

        this._currentData = this.resetContainer();
        this.queryContainer(this._currentData, start, "forward")
            .then(() => {
                return this.prepareReservedContainers();
            })
            .then(() => {
                df.resolve();
            })
            .fail(() => {
                df.reject();
            });

        return df;
    }

    /**
     * shiftBackwardContainer
     * private async method.
     */
    private shiftBackwardContainer(): JQueryDeferred<any> {
        if (!this.validContainer(this._currentData, true) || !this.validContainer(this._prevData)) {
            console.error(TAG + "validContainer(), failed.");
            return $.Deferred().reject();
        }

        $.extend(true, this._nextData, this._currentData);
        $.extend(true, this._currentData, this._prevData);
        this._prevData = this.resetContainer();

        return this.prepareBackwardContainer();
    }

    /**
     * shiftForwardContainer
     * private async method.
     */
    private shiftForwardContainer(): JQueryDeferred<any> {
        if (!this.validContainer(this._currentData, true) || !this.validContainer(this._nextData)) {
            console.error(TAG + "validContainer(), failed.");
            return $.Deferred().reject();
        }

        $.extend(true, this._prevData, this._currentData);
        $.extend(true, this._currentData, this._nextData);
        this._nextData = this.resetContainer();

        return this.prepareForwardContainer();
    }

    /**
     * checkIterateRange
     * private helper method.
     */
    private checkIterateRange(index: number): RangeResult {
        const result = {
            canSync: false,
            container: null,
            localIndex: INVALID_INDEX,
            shift: "",
        };

        if (this.isInRange(index, this._currentData)) {
            result.canSync = true;
            result.container = this._currentData;
            result.localIndex = index - this._currentData.start;
            return result;
        } else if (this.isInRange(index, this._prevData)) {
            result.canSync = true;
            result.container = this._prevData;
            result.localIndex = index - this._prevData.start;
            result.shift = "backward";
            return result;
        } else if (this.isInRange(index, this._nextData)) {
            result.canSync = true;
            result.container = this._nextData;
            result.localIndex = index - this._nextData.start;
            result.shift = "forward";
            return result;
        }

        return result;
    }

    /**
     * isInRange
     * private helper method.
     */
    private isInRange(index: number, target: Container): boolean {
        if (!this.validContainer(target, true)) {
            return false;
        }
        if (target.start <= index && index < target.start + target.container.size()) {
            return true;
        } else {
            return false;
        }
    }
}

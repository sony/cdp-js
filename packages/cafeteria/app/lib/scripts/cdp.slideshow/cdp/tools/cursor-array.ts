import { INVALID_INDEX } from "./constants";

const TAG = "[CDP.Tools.CursorArray] ";

/**
 * @interface PropertyAccesser
 */
export interface PropertyAccesser {
    (element: any): any;
    async?: boolean;
}

/**
 * @class CursorArray
 * @brief Provide cursor interface for Array object.
 *        NOTE: This class does not have metaphor for BOF and EOF.
 */
export class CursorArray {
    private _array: any[] = null;
    private _index: number = INVALID_INDEX;
    private _accesser: PropertyAccesser = null;

    /**
     * constructor
     *
     * @param {Array}  target Target Array object.
     * @param {Object} accesser Property accesser function object.
     */
    constructor(target: any[], accesser?: PropertyAccesser) {
        this.setArray(target, accesser);
    }

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * setArray
     * set array contents this CursorArray class.
     *
     * @param {Array}  target Target Array object.
     * @param {Object} accesser Property accesser function object.
     */
    public setArray(target: any[], propAccesser?: PropertyAccesser): boolean {
        if (!(target instanceof Array) || 0 === target.length) {
            console.error(TAG + "target is not valid array.");
            this.reset();
            return false;
        } else {
            this.reset();
            this._array = target;
            this._index = 0;        // set first content.
            if (!!propAccesser) {
                this._accesser = propAccesser;
            }
            return true;
        }
    }

    // set accesser property
    public set accesser(propAccesser: PropertyAccesser) {
        this._accesser = propAccesser;
    }

    // get accesser property
    public get accesser(): PropertyAccesser {
        return this._accesser;
    }

    /**
     * Check the object has async property accesser
     *
     * @return {Boolean} true: has / flase: doesn't have.
     */
    public hasAsyncAccesser(): boolean {
        return this._accesser ? !!this._accesser.async : false;
    }

    /**
     * get
     *
     * @param {Number} index, array index.
     * @return Array value of index position.
     */
    public get(index?: number): any {
        const element = this.getData(index);
        if (null != element && !!this._accesser) {
            return this._accesser(element);
        } else {
            return element;
        }
    }

    /**
     * getData
     * returns array element.
     *
     * @param {Number} index, array index.
     * @return Array value of index position.
     */
    public getData(index?: number): any {
        if (!this.valid()) {
            return null;
        }

        index = (null != index) ? index : this._index;
        if (INVALID_INDEX === index || index < 0 || this.size() - 1 < index) {
            console.error(TAG + "invalid range. index: " + index);
            return null;
        }

        return this._array[index];
    }

    /**
     * remove
     * Remove index element.
     *
     * @param @param {Number} index, array index.
     * @return {Boolean} true: succeeded / false: failed.
     */
    public remove(index?: number): boolean {
        if (!this.valid()) {
            return false;
        }

        index = (null != index) ? index : this._index;
        if (INVALID_INDEX === index || index < 0 || this.size() - 1 < index) {
            console.error(TAG + "invalid range. index: " + index);
            return false;
        }

        this._array.splice(index, 1);
        return true;
    }

    /**
     * size
     *
     * @return {Number} size of array
     */
    public size(): number {
        if (!this.valid()) {
            return 0;
        } else {
            return this._array.length;
        }
    }

    /**
     * getIndex
     *
     * @return current index position value.
     */
    public getIndex(): number {
        return this._index;
    }

    /**
     * getArray
     * Get raw Array object's 'shallow' copy.
     * NOTE: If you override array's element, reflected to original.
     *
     * @param  raw {Boolean} [in] true: raw array reference / false: shallow copy instance.
     * @return {Object} array object.
     */
    public getArray(raw: boolean = false): any[] {
        if (!this.valid()) {
            return null;
        }
        if (raw) {
            return this._array;
        } else {
            return this._array.slice(0);
        }
    }

    /**
     * isFirst
     * Check index position of first.
     */
    public isFirst(): boolean {
        if (!this.valid()) {
            return false;
        }
        return 0 === this._index;
    }

    /**
     * isLast
     * Check index position of last.
     */
    public isLast(): boolean {
        if (!this.valid()) {
            return false;
        }
        return (this._array.length - 1) === this._index;
    }

    /**
     * seek
     * Jamp to index position.
     *
     * @param {Number} index Target index.
     * @return Array value of index position.
     */
    public seek(index: number): any {
        if (!this.valid()) {
            return null;
        }

        if (0 <= index && index < this._array.length) {
            this._index = index;
            return this.get();
        } else {
            console.error(TAG + "invalid index range.");
            return null;
        }
    }

    /**
     * first
     * Move cursor first index.
     *
     * @return Array value of index position.
     */
    public first(): any {
        return this.seek(0);
    }

    /**
     * last
     * Move cursor last index.
     *
     * @return Array value of index position.
     */
    public last(): any {
        if (!this.valid()) {
            return null;
        }
        return this.seek(this._array.length - 1);
    }

    /**
     * previous
     * Move cursor previous index.
     *
     * @return Array value of index position.
     */
    public previous(): any {
        if (!this.valid()) {
            return null;
        }

        if (this._index <= 0) {
            return null;
        } else {
            this._index--;
            return this.get();
        }
    }

    /**
     * next
     * Move cursor next index.
     *
     * @return Array value of index position.
     */
    public next(): any {
        if (!this.valid()) {
            return null;
        }

        if (this._array.length - 1 <= this._index) {
            return null;
        } else {
            this._index++;
            return this.get();
        }
    }

    /**
     * reset
     * reset CursorArray state.
     *
     */
    public reset(): void {
        this._array = null;
        this._index = INVALID_INDEX;
    }

    /**
     * valid
     * valid CursorArray state.
     */
    public valid(): boolean {
        return !!this._array;
    }
}


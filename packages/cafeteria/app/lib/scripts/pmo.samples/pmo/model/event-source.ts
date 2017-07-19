import * as _ from "underscore";
import * as Backbone from "backbone";

/* tslint:disable:ban */

/**
 * @class EventSource
 * @brief Backbone.Event を実装を提供する基底クラス
 */
export class EventSource {

    //! 派生クラスの型を指定
    constructor(_class: any) {
        _.extend(_class.prototype, Backbone.Events);
    }

    ///////////////////////////////////////////////////////////////////////
    // Implements: Backbone.Event

    on(eventName: any, callback?: Function, context?: any): any {
        // dummy imple.
    }

    off(eventName?: string, callback?: Function, context?: any): any {
        // dummy imple.
    }

    trigger(eventName: string, ...args: any[]): any {
        // dummy imple.
    }

    bind(eventName: string, callback: Function, context?: any): any {
        // dummy imple.
    }

    unbind(eventName?: string, callback?: Function, context?: any): any {
        // dummy imple.
    }

    once(events: string, callback: Function, context?: any): any {
        // dummy imple.
    }

    listenTo(object: any, events: string, callback: Function): any {
        // dummy imple.
    }

    listenToOnce(object: any, events: string, callback: Function): any {
        // dummy imple.
    }

    stopListening(object?: any, events?: string, callback?: Function): any {
        // dummy imple.
    }
}

///////////////////////////////////////////////////////////////////////
// closure methods

// remove dummy imple.
delete EventSource.prototype.on;
delete EventSource.prototype.off;
delete EventSource.prototype.trigger;
delete EventSource.prototype.bind;
delete EventSource.prototype.unbind;
delete EventSource.prototype.once;
delete EventSource.prototype.listenTo;
delete EventSource.prototype.listenToOnce;
delete EventSource.prototype.stopListening;

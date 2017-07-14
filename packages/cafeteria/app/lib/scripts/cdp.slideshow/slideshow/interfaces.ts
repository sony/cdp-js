export interface TransitionProperty {
    start?: any;
    end?: any;
}

export interface TransitionTarget {
    $element: JQuery;
    fade?: TransitionProperty;
    transform?: TransitionProperty;
}

export interface TransitionSettings {
    viewport: JQuery;
    oldTarget?: TransitionTarget;
    newTarget: TransitionTarget;
    fadeDuration?: number;
    fadeTimingFunction?: string;
    transformDuration?: number;
    transformTimingFunction?: string;
    focusDuration: number;
}

export interface TimerAnimationParam {
    start: number;
    end: number;
    distance: number;
}

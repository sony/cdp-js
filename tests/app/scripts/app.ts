/// <reference path="_dev.dependencies.d.ts" />

// view entry
/// <amd-dependency path="tests/app/scripts/View/Root" />

/* tslint:disable:no-unused-variable */

import * as _Hogan from "hogan";
import * as _IScroll from "iscroll";
// non-module entity
import { global, Framework, UI } from "cdp";

const TAG: string = "[app] ";
const Config = global.Config;

function onStart(): void {
    // for dev. always show vertical scroll bar.
    if (Config.DEBUG && !Framework.Platform.Mobile) {
        $("body").css("overflow-y", "scroll");
    }
    // for ios7+
    if (Framework.Platform.iOS) {
        $("html").addClass("platform-ios");
    }

    let router = CDP.Framework.Router;
    router.register("", "/templates/main.html", true);
    // start Router.
    router.start();
}

global.Hogan = global.Hogan || _Hogan;
global.IScroll = global.IScroll || _IScroll;

export { onStart as main };


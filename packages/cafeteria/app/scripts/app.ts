import "hogan";
import "jquery-hammerjs";
import { global } from "cdp";

/* tslint:disable:no-string-literal */
import * as Hammer from "hammerjs";
global["Hammer"] = Hammer;
import * as IScroll from "iscroll";
global["IScroll"] = IScroll;
import * as Flipsnap from "flipsnap";
global["Flipsnap"] = Flipsnap;
/* tslint:enable:no-string-literal */

import { Router as router } from "cdp/framework";
import { Theme } from "cdp/ui";
import "./view/loader";

const TAG: string = "[app] ";

function onStart(): void {
    // for dev. always show vertical scroll bar.
    Theme.detectUIPlatform();

    router.register("", "/templates/main.html", true);
    // start Router.
    router.start();
}

export { onStart as main };

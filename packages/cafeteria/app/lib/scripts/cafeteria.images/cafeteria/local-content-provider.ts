/* tslint:disable:no-unused-variable no-unused-vars */

import { Platform } from "cdp/framework";
import StubProvider from "./bridge/stub-local-content-provider";
import NativeProvider from "./bridge/native-local-content-provider";

// TODO: 切り替え
const LocalContentProvider = StubProvider;

export { LocalContentProvider };

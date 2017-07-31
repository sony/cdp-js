/* tslint:disable:no-unused-variable */
import { Platform } from "cdp/framework";
import StubProvider from "./bridge/stub-local-content-provider";
import NativeProvider from "./bridge/native-local-content-provider";
export * from "./bridge/native-local-content-provider";

//const LocalContentProvider = Platform.Mobile ? NativeProvider : StubProvider;
const LocalContentProvider = StubProvider;
const TextileProvider = StubProvider;

export { LocalContentProvider, TextileProvider };

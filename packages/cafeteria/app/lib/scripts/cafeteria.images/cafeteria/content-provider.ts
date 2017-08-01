import { Platform } from "cdp/framework";
import AssetsContentProvider from "./bridge/assets-content-provider";
import NativeProvider from "./bridge/local-content-provider";
export * from "./bridge/local-content-provider";

const LocalContentProvider = Platform.Mobile ? NativeProvider : AssetsContentProvider;

export { LocalContentProvider, AssetsContentProvider };

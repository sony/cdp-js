/*
 * [NOTE] AMD entries module must be named for releases build
 *
 * 生成する d.ts に AMD module 名を設定するために、
 * <amd-module name/> の triple slash directive が必須
 */
/// <amd-module name="cafeteria.images" />

export * from "./cafeteria/error-defs";
export * from "./cafeteria/image-interface";
export * from "./cafeteria/image-item-generator";
export * from "./cafeteria/content-provider";

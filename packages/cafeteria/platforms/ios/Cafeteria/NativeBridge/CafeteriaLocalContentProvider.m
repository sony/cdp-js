/**
 * @file CafeteriaLocalContentProvider.m
 * @brief Local Content Path Provider implementation file.
 */

#import <Photos/Photos.h>
#import <AssetsLibrary/ALAssetsLibrary.h>
#import <AssetsLibrary/ALAssetsGroup.h>
#import <AssetsLibrary/ALAsset.h>
#import <AssetsLibrary/ALAssetRepresentation.h>
#import "../Plugins/cordova-plugin-cdp-nativebridge/CDPGate.h"
#import "../Plugins/cordova-plugin-cdp-nativebridge/CDPNativeBridgeMsgUtils.h"

#define TAG @"[NativeBridge][LocalContentProvider]"

const boolean_t ENABLE_PHOTOS_FRAMEWORK = true;

// this class is instantiated by refrection. need not the header file.
@interface CafeteriaLocalContentProvider : CDPGate
@end

@implementation CafeteriaLocalContentProvider

/**
 * queryLocalContents
 *
 * @param index [in] query start index.
 */
- (void) queryLocalContents:(NSNumber*)index :(NSNumber*)limit
{
    CDPMethodContext* context = [self getContext];
    
    if (ENABLE_PHOTOS_FRAMEWORK) {
        [self queryLocalContentsByPhotosFramework:context withIndex:[index integerValue] andLimit:[limit integerValue]];
    } else {
        [self queryLocalContentsByAssetsLibrary:context withIndex:[index integerValue] andLimit:[limit integerValue]];
    }
}

/**
 * queryThumbnailByKey
 *
 * @param key [in] queryLocalContents で返却された key を指定.
 */
- (void) queryThumbnailByKey:(NSString*)key
{
    CDPMethodContext* context = [self getContext];
    
    if (ENABLE_PHOTOS_FRAMEWORK) {
        [self queryThumbnailByPhotosFramework:context forKey:key];
    } else {
        [self queryThumbnailByAssetsLibrary:context forKey:key];
    }
}

/**
 * queryImageSourceByKey
 *
 * @param key [in] queryLocalContents で返却された key を指定.
 */
- (void) queryImageSourceByKey:(NSString*)key
{
    CDPMethodContext* context = [self getContext];
    
    if (ENABLE_PHOTOS_FRAMEWORK) {
        [self queryImageSourceByPhotosFramework:context forKey:key];
    } else {
        [self queryImageSourceByAssetsLibrary:context forKey:key];
    }
}

//________________________________________________________________________________________________________________//

/**
 * AssetSourceTypes に指定可能なすべての写真を作成日時の降順で取得
 *
 * @private
 * @return 写真が対象の PHFetchResult
 */
- (PHFetchResult*) getAllPhotos
{
    @synchronized (self) {
        PHFetchOptions* options = [PHFetchOptions new];
        options.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:NO]];
        options.includeAssetSourceTypes = PHAssetSourceTypeUserLibrary | PHAssetSourceTypeCloudShared | PHAssetSourceTypeiTunesSynced;
        PHFetchResult* allPhotos = [PHAsset fetchAssetsWithMediaType:PHAssetMediaTypeImage options:options];
        return allPhotos;
    }
}

/**
 * Key を指定して PHAsset オブジェクトを取得
 *
 * @private
 * @param key [in] asset key (URL)
 * @return PHAsset object
 */
- (PHAsset*) getPhotoByKey:(NSString*)key
{
    @synchronized (self) {
        PHFetchResult* fetch = [PHAsset fetchAssetsWithLocalIdentifiers:@[key] options:nil];
        return fetch.firstObject;
    }
}

//________________________________________________________________________________________________________________//

/**
 * queryLocalContents by Photos Framework.
 *
 * @private
 * @param context [in] Method Context instance.
 * @param index   [in] query start index
 */
- (void) queryLocalContentsByPhotosFramework:(CDPMethodContext*)context withIndex:(NSInteger)index andLimit:(NSInteger)limit
{
    [self.commandDelegate runInBackground:^{
        PHFetchResult* fetch = [self getAllPhotos];
        
        NSUInteger totalContentCount = fetch.count;
        const int MAX_QUERY_SIZE = (int)limit;
        
        if (0 != (int)totalContentCount && totalContentCount <= index) {
            NSString* msg = [NSString stringWithFormat:@"%@ Invalid index: %d total count: %d.", TAG, (int)index, (int)totalContentCount];
            [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_INVALID_ARG andMessage:msg];
            return;
        }
        
        NSMutableIndexSet* indexes = [[NSMutableIndexSet alloc] init];
        int querySize = MIN(MAX_QUERY_SIZE, (int)(totalContentCount - index));
        for (int i = 0; i < querySize; i++) {
            [indexes addIndex:(index + i)];
        }
        
        {
            NSMutableDictionary* result = [@{} mutableCopy];
            NSMutableArray* contents = [@[] mutableCopy];
            result[@"totalContentCount"] = [NSNumber numberWithInteger:totalContentCount];
            result[@"contents"] = contents;
            __block BOOL canceled = NO;
            
            [self setCancelable:context];
            
            [fetch enumerateObjectsAtIndexes:indexes
                                     options:0
                                  usingBlock:^(PHAsset* asset, NSUInteger index, BOOL* stop) {
                                      if ([self isCanceled:context]) {
                                          [self removeCancelable:context];
                                          *stop = canceled = YES;
                                      } else if (nil != asset && NSNotFound != index) {
                                          NSDictionary* content = [self valueForProperties:asset withIndex:index];
                                          [contents addObject:content];
                                      } else {
                                          NSLog(@"%@, asset not found. [index:%ld]", TAG, index);
                                      }
                                  }];
            
            [self removeCancelable:context];

            if (canceled) {
                NSString* msg = [NSString stringWithFormat:@"%@ queryLocalContents() is canceled.", TAG];
                [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_CANCEL andMessage:msg];
            } else {
                [self resolveParams:context withParams:@[result]];
            }
        }
    }];
}

/**
 * get photo properties.
 *
 * @private
 * @param asset   [in] PHAsset instance.
 * @param index   [in] asset's index
 * @return NSDictionary
 */
- (NSDictionary*) valueForProperties:(PHAsset*)asset withIndex:(NSUInteger)index
{
    NSString* assetKey = asset.localIdentifier;
    NSNumber* widthOrg = [NSNumber numberWithUnsignedInteger:asset.pixelWidth];
    NSNumber* heightOrg = [NSNumber numberWithUnsignedInteger:asset.pixelHeight];
    __block NSNumber* width = nil;
    __block NSNumber* height = nil;
    
    @synchronized (self) {
        PHImageManager* imageManager = [PHImageManager defaultManager];
        PHImageRequestOptions* options = [[PHImageRequestOptions alloc] init];
        options.synchronous = YES;
        [imageManager requestImageDataForAsset:asset
                                       options:options
                                 resultHandler:^(NSData * __nullable imageData, NSString * __nullable dataUTI, UIImageOrientation orientation, NSDictionary * __nullable info) {
                                     switch (orientation) {
                                         case UIImageOrientationLeft:
                                         case UIImageOrientationRight:
                                         case UIImageOrientationLeftMirrored:
                                         case UIImageOrientationRightMirrored:
                                             width = heightOrg;
                                             height = widthOrg;
                                             break;
                                         default:
                                             width = widthOrg;
                                             height = heightOrg;
                                             break;
                                     }
                                 }];
    }
    
    // set props.
    NSDictionary* props = @{
                            @"key": assetKey,
                            @"index": [NSNumber numberWithInteger:index],
                            @"width": width,
                            @"height": height,
                            };
    
    return props;
}

//________________________________________________________________________________________________________________//

/**
 * 画像 orientation を正規化
 *
 * @private
 * @param image [in] source image
 * @return orientation 正規化した image
 */
- (UIImage*)normalizedImage:(UIImage*)image {
    if (image.imageOrientation == UIImageOrientationUp) {
        return image;
    }
    UIGraphicsBeginImageContextWithOptions(image.size, NO, image.scale);
    [image drawInRect:(CGRect){0, 0, image.size}];
    UIImage* normalizedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return normalizedImage;
}

/**
 * UIImage を Data-URL に変換
 *
 * @private
 * @param  image [in] UIImange instance
 * @return data-url string
 */
- (NSString*) dataUrlForUIImage:(UIImage*)image
{
    NSData* imgData = [[NSData alloc] initWithData:UIImageJPEGRepresentation([self normalizedImage:image], 1.0f)];
    NSString* mimeType;
    uint8_t chunk = 0;
    
    [imgData getBytes:&chunk length:1];
    switch (chunk) {
        case 0xFF:
            mimeType = @"image/jpeg";
            break;
        case 0x89:
            mimeType = @"image/png";
            break;
        case 0x47:
            mimeType = @"image/gif";
            break;
        case 0x42:
            mimeType = @"image/bmp";
            break;
        case 0x49:
        case 0x4D:
            mimeType = @"image/tiff";
            break;
        default:
            mimeType = @"image/jpeg"; // for fail safe.
            break;
    }
    
    return [NSString stringWithFormat:@"data:%@;base64,%@", mimeType, [imgData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed]];
}

/**
 * queryThumbnailByKey by Photos Framework.
 *
 * @private
 * @param context [in] Method Context instance.
 * @param key     [in] queryLocalContents で返却された key を指定.
 */
- (void) queryThumbnailByPhotosFramework:(CDPMethodContext*)context forKey:(NSString*)key
{
    [self.commandDelegate runInBackground:^{
        PHAsset* asset = [self getPhotoByKey:key];
        if (nil != asset) {
            const CGFloat THUMBNAIL_SIZE = 150.0;
            @synchronized (self) {
                PHImageManager* imageManager = [PHImageManager defaultManager];
                PHImageRequestOptions* options = [[PHImageRequestOptions alloc] init];
                options.resizeMode = PHImageRequestOptionsResizeModeFast;
                options.synchronous = YES;
                [imageManager requestImageForAsset:asset
                                        targetSize:CGSizeMake(THUMBNAIL_SIZE, THUMBNAIL_SIZE)
                                       contentMode:PHImageContentModeAspectFill
                                           options:options
                                     resultHandler:^(UIImage* _Nullable result, NSDictionary* _Nullable info) {
                                         [self resolveParams:context withParams:@[[self dataUrlForUIImage:result]]];
                                         [self removeCancelable:context];
                                     }];
            }
        } else {
            NSString* msg = [NSString stringWithFormat:@"%@ Asset not found. [%@]", TAG, key];
            [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_FAIL andMessage:msg];
        }
    }];
}

/**
 * queryImageSourceByKey by Photos Framework.
 *
 * @private
 * @param context [in] Method Context instance.
 * @param key     [in] queryLocalContents で返却された key を指定.
 */
- (void) queryImageSourceByPhotosFramework:(CDPMethodContext*)context forKey:(NSString*)key
{
    [self.commandDelegate runInBackground:^{
        PHAsset* asset = [self getPhotoByKey:key];
        if (nil != asset) {
            @synchronized (self) {
                PHImageManager* imageManager = [PHImageManager defaultManager];
                PHImageRequestOptions* options = [[PHImageRequestOptions alloc] init];
                options.resizeMode = PHImageRequestOptionsResizeModeExact;
                options.synchronous = YES;
                [imageManager requestImageForAsset:asset
                                        targetSize:PHImageManagerMaximumSize
                                       contentMode:PHImageContentModeAspectFill
                                           options:options
                                     resultHandler:^(UIImage* _Nullable result, NSDictionary* _Nullable info) {
                                         [self resolveParams:context withParams:@[[self dataUrlForUIImage:result]]];
                                         [self removeCancelable:context];
                                     }];
            }
        } else {
            NSString* msg = [NSString stringWithFormat:@"%@ Asset not found. [%@]", TAG, key];
            [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_FAIL andMessage:msg];
        }
    }];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// ALAssetsLibrary: depricated in iOS 9.0

/**
 * queryLocalContents by Assets Library
 * duplicate. instead use Photos Framework in the future.
 *
 * @private
 * @param context [in] Method Context instance.
 * @param index   [in] query start index
 */
- (void) queryLocalContentsByAssetsLibrary:(CDPMethodContext*)context withIndex:(NSInteger)index andLimit:(NSInteger)limit
{
    [self.commandDelegate runInBackground:^{
        ALAssetsLibrary* library = [[ALAssetsLibrary alloc] init];
        [library enumerateGroupsWithTypes:ALAssetsGroupSavedPhotos
                               usingBlock:^(ALAssetsGroup *group, BOOL *stop) {
                                   if (group) {
                                       [self enumrateSavedPhotos:context withGroup:group andIndex:index andLimit:limit];
                                   }
                               }
                             failureBlock:^(NSError *error) {
                                 NSString* msg = [NSString stringWithFormat:@"%@ Group not found.", TAG];
                                 [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_FAIL andMessage:msg];
                             }];
    }];
}

/**
 * enumrate saved photos
 *
 * @private
 * @param context [in] Method Context instance.
 * @param group   [in] ALAssetsGroup (SavedPhots) instance.
 * @param index   [in] query start index
 */
- (void) enumrateSavedPhotos:(CDPMethodContext*)context withGroup:(ALAssetsGroup*)group andIndex:(NSInteger)index andLimit:(NSInteger)limit
{
    NSInteger totalContentCount = [group numberOfAssets];
    const int MAX_QUERY_SIZE = (int)limit;
    
    if (0 != (int)totalContentCount && totalContentCount <= index) {
        NSString* msg = [NSString stringWithFormat:@"%@ Invalid index: %d total count: %d.", TAG, (int)index, (int)totalContentCount];
        [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_INVALID_ARG andMessage:msg];
        return;
    }
    
    NSMutableIndexSet* indexes = [[NSMutableIndexSet alloc] init];
    int querySize = MIN(MAX_QUERY_SIZE, (int)(totalContentCount - index));
    for (int i = 0; i < querySize; i++) {
        [indexes addIndex:(index + i)];
    }
    
    {
        NSMutableDictionary* result = [@{} mutableCopy];
        NSMutableArray* contents = [@[] mutableCopy];
        result[@"totalContentCount"] = [NSNumber numberWithInteger:totalContentCount];
        result[@"contents"] = contents;
        
        [self setCancelable:context];
        
        [group enumerateAssetsAtIndexes:indexes
                                options:0
                             usingBlock:^(ALAsset *asset, NSUInteger index, BOOL *stop) {
                                 if ([self isCanceled:context]) {
                                     NSString* msg = [NSString stringWithFormat:@"%@ queryLocalContents() is canceled.", TAG];
                                     [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_CANCEL andMessage:msg];
                                     [self removeCancelable:context];
                                 } else if (nil != asset && NSNotFound != index) {
                                     NSDictionary* content = [self valueForPropertiesALAsset:asset withIndex:index];
                                     [contents addObject:content];
                                 } else {
                                     [self resolveParams:context withParams:@[result]];
                                     [self removeCancelable:context];
                                 }
                             }];
    }
}

/**
 * get photo properties.
 *
 * @private
 * @param asset   [in] ALAsset instance.
 * @param index   [in] asset's index
 * @return NSDictionary
 */
- (NSDictionary*) valueForPropertiesALAsset:(ALAsset*)asset withIndex:(NSUInteger)index
{
    ALAssetRepresentation* representation = [asset defaultRepresentation];
    id propUrls = [asset valueForProperty:ALAssetPropertyURLs];
    NSString* assetKey = [[propUrls objectForKey:[representation UTI]] absoluteString];
    
    CGSize dimensions = [representation dimensions];
    NSNumber* widthOrg = [NSNumber numberWithFloat:dimensions.width];
    NSNumber* heightOrg = [NSNumber numberWithFloat:dimensions.height];
    NSNumber* width = nil;
    NSNumber* height = nil;
    
    NSNumber* orientation = [asset valueForProperty:ALAssetPropertyOrientation];
    switch ([orientation integerValue]) {
        case ALAssetOrientationLeft:
        case ALAssetOrientationRight:
        case ALAssetOrientationLeftMirrored:
        case ALAssetOrientationRightMirrored:
            width = heightOrg;
            height = widthOrg;
            break;
        default:
            width = widthOrg;
            height = heightOrg;
            break;
    }
    
    // set props.
    NSDictionary* props = @{
                            @"key": assetKey,
                            @"index": [NSNumber numberWithInteger:index],
                            @"width": width,
                            @"height": height,
                            };
    
    return props;
}

//________________________________________________________________________________________________________________//

/**
 * queryDataUrl by Assets Library
 * duplicate. instead use Photos Framework in the future.
 *
 * @private
 * @param context [in] Method Context instance.
 * @param key     [in] asset key (URL)
 */
- (void) queryDataUrlByAssetsLibrary:(CDPMethodContext*)context forKey:(NSString*)key withType:(NSString*)type
{
    [self setCancelable:context];
    
    [self.commandDelegate runInBackground:^{
        ALAssetsLibrary* library = [[ALAssetsLibrary alloc] init];
        [library assetForURL:[NSURL URLWithString:key]
                 resultBlock:^(ALAsset* asset) {
                     if ([self isCanceled:context]) {
                         NSString* msg = [NSString stringWithFormat:@"%@ queryThumbnailByKey() is canceled.", TAG];
                         [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_CANCEL andMessage:msg];
                         [self removeCancelable:context];
                     } else if ([type isEqualToString:@"thumbnail"]){
                         NSString* thuIsmbnailUrl = [self valueForThunmbnailALAsset:asset];
                         [self resolveParams:context withParams:@[thuIsmbnailUrl]];
                         [self removeCancelable:context];
                     } else if ([type isEqualToString:@"imageSource"]){
                         NSString* imageSourceUrl = [self valueForImageSourceALAsset:asset];
                         [self resolveParams:context withParams:@[imageSourceUrl]];
                         [self removeCancelable:context];
                     } else {
                         NSString* msg = [NSString stringWithFormat:@"%@ unknown operation. [operation: %@]", TAG, type];
                         [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_FAIL andMessage:msg];
                         [self removeCancelable:context];
                     }
                 }
                failureBlock:^(NSError *error) {
                    NSString* msg = [NSString stringWithFormat:@"%@ Asset not found.", TAG];
                    [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_FAIL andMessage:msg];
                    [self removeCancelable:context];
                }];
    }];
}

/**
 * queryThumbnailByKey by Assets Library
 * duplicate. instead use Photos Framework in the future.
 *
 * @private
 * @param context [in] Method Context instance.
 * @param key     [in] asset key (URL)
 */
- (void) queryThumbnailByAssetsLibrary:(CDPMethodContext*)context forKey:(NSString*)key
{
    [self queryDataUrlByAssetsLibrary:context forKey:key withType:@"thumbnail"];
}

/**
 * get thumbnail data.
 *
 * @private
 * @param asset   [in] ALAsset instance.
 * @return NSString
 */
- (NSString*) valueForThunmbnailALAsset:(ALAsset*)asset
{
    UIImage* thumbImg = [UIImage imageWithCGImage:[asset thumbnail]];
    NSData* thumbData = [[NSData alloc] initWithData:UIImageJPEGRepresentation(thumbImg, 1.0f)];
    return [NSString stringWithFormat:@"data:image/jpeg;base64,%@", [thumbData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed]];
}

//________________________________________________________________________________________________________________//

/**
 * queryImageSourceByKey by Assets Library
 * duplicate. instead use Photos Framework in the future.
 *
 * @private
 * @param context [in] Method Context instance.
 * @param key     [in] asset key (URL)
 */
- (void) queryImageSourceByAssetsLibrary:(CDPMethodContext*)context forKey:(NSString*)key
{
    [self queryDataUrlByAssetsLibrary:context forKey:key withType:@"imageSource"];
}

/**
 * get image source data.
 *
 * @private
 * @param asset   [in] ALAsset instance.
 * @return NSString
 */
- (NSString*) valueForImageSourceALAsset:(ALAsset*)asset
{
    ALAssetRepresentation* representation = [asset defaultRepresentation];
    UIImage* fullScreenImg = [UIImage imageWithCGImage:[representation fullScreenImage] scale:2.0f orientation:UIImageOrientationUp];
    NSData* imgData = [[NSData alloc] initWithData:UIImageJPEGRepresentation(fullScreenImg, 1.0f)];
    return [NSString stringWithFormat:@"data:image/jpeg;base64,%@", [imgData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed]];
}

@end

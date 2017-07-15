export namespace Metadata {

    export interface Device {
        make?: string;
        model?: string;
    }

    export interface GPS {
        altitude?: number;
        imgdirection?: number;
        imgdirectionref?: string;
        latitude?: number;
        longitude?: number;
        mapdatum?: string;
    }

    export interface Meta3d {
        cross_eyed_3d?: boolean;
        enable_3d?: boolean;
        format_type_3d?: string;
    }
}

export interface MetadataInfo {
    description?: string;
    device?: Metadata.Device;
    gps?: Metadata.GPS;
    image_orientation?: number;
    meta3d?: Metadata.Meta3d;
    modified_date?: string;
    orientation?: number;
    rating?: number;
    recorded_date?: string;
    thumbnail_orientation?: number;
    title?: string;
}

export interface ThumbnailInfo {
    height?: number;
    key?: string;
    location?: string;
    width?: number;
}

export interface ItemInfo {
    content_modified_date?: string;
    duration?: number;
    file_name?: string;
    file_size?: number;
    hash?: string;
    height?: number;
    is_3d?: boolean;
    is_original?: boolean;
    is_panoramic?: boolean;
    item_id?: string;
    item_web_url?: string;
    recorded_date?: string;
    meta_modified_date?: string;
    metadata?: MetadataInfo;
    mime_type?: string;
    modified_date?: string;
    owner_id?: string;
    score?: number;
    status?: string;
    status_flv?: string;
    status_mp4?: string;
    status_three_gp?: string;
    thumbnail?: ThumbnailInfo[];
    upload_url?: string;
    uploaded_date?: string;
    url_3gp_video?: string;
    url_flv_video?: string;
    url_mp4_video?: string;
    width?: number;
}

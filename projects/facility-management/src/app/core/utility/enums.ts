/** FileOptions */
export enum FileOptions {
    UPLOAD_FILE = 1,
    SHARE_FILE_PATH = 2
}

/** ImageType */
export enum ImageType {
    Scan_Type  = 1,
    Scan_Image  = 'Scanned Image',
    Delivery_Type  = 2,
    Delivery_Image  = 'Delivery Image',
    Signature_Type   = 3,
    Signature_Image   = 'Signature Image'
}

/** ConformationDelete */
export enum ConformationDelete {
    Conformation_Massage = 'Do you really want to delete this record?',
    Positive_Action = 'Delete',
    Negative_Action = 'Cancel'
}

/** ScanType enum for seclect scantype for packages */
export enum ScanType {
    Mobile = 1,
    Web = 2
}
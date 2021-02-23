/** CopyIt picked assets reads */
export class CopyItPickAsset {
    public isActive: boolean;
    public copyItAssetId: number;
    public copyItAssetMeterId: number;
    public assetId: number;
    public manufacturer: string;
    public assetNo: string;
    public modelNo: string;
    public assetMeterId: number;

    public colorPaperSideTypeId: number;
    public colorDefaultClientRate: number;
    public colorDefaultTenantRate: number;
    public previousColorRead: number;
    public currentColorRead: number;
    public colorRate: number;
    public colorTenantRate: number;
    public colorClientConfigureDefaultId: number;
    public colorClientConfigureDefault: string;

    public bWPaperSideTypeId: number;
    public bWDefaultClientRate: number;
    public bWDefaultTenantRate: number;
    public previousBWRead: number;
    public currentBWRead: number;
    public bWRate: number;
    public bWTenantRate: number;
    public bWClientConfigureDefaultId: number;
    public bWClientConfigureDefault: string;

    public previousScanRead: number;
    public currentScanRead: number;
    public scanRate: number;
    public scanTenantRate: number;

    public meterBWRate: number;
    public meterColorRate: number;
    public meterScanRate: number;

    // following properties are used to store concat strings for estimating charges
    public chargeColorRead?: number;
    public chargeBWRead?: number;
    public chargeColorRate?: number;
    public chargeBWRate?: number;
    public paperSizeColorOptionDetail?: string;
    public paperSizeBWOptionDetail?: string;
}

/** CopyIt Selected Asset */
export class CopyItAsset {
    public copyItAssetId: number;
    public assetId: number;
    constructor(
        { copyItAssetId, assetId }: any
    ) {
        this.copyItAssetId = copyItAssetId;
        this.assetId = assetId;
    }
}
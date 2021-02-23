import { Injectable } from '@angular/core';
// ------------------------------------------- //
import { CopyitCommonService } from '../../../../../shared/modules/copy-it-print-details/copyit-common.service';
import { CopyItPaperSideType, CopyItReproductionType } from '../../../../../shared/modules/copy-it-print-details/models/copy-it.enum';
import {
  CopyItDetailEnvelopes, CopyItDetailFinishings, CopyItDetailOversizedCopies, CopyItDetailPaperColors,
  CopyItDetailPaperSizes, CopyItDetailPaperStocks, CopyItDetailReproductionTypes, CopyItInfo,
  CopyItPickAsset, TabResponse
} from '../../../../../shared/modules/copy-it-print-details/models/copyit-info';

@Injectable()
export class CopyitChargesPresenter {

  constructor(
    private copyItCommonService: CopyitCommonService
  ) { }

  /**
   * Set Envelopes
   * @param copyItInfo 
   */
  public setEnvelopes(copyItInfo: CopyItInfo): CopyItDetailEnvelopes[] {
    return copyItInfo.envelopes || [];
  }

  /**
   * Set Finishings
   * @param copyItInfo 
   */
  public setFinishings(copyItInfo: CopyItInfo): CopyItDetailFinishings[] {
    return copyItInfo.finishings || [];
  }

  /**
   * Set OverSized Copies
   * @param copyItInfo 
   */
  public setOverSizedCopies(copyItInfo: CopyItInfo): CopyItDetailOversizedCopies[] {
    return copyItInfo.overSizedCopies || [];
  }

  /**
   * Set PaperColors
   * @param copyItInfo 
   */
  public setPaperColors(copyItInfo: CopyItInfo): CopyItDetailPaperColors[] {
    const arr = [];
    if (copyItInfo.middlePageColor) { arr.push(copyItInfo.middlePageColor); }
    if (copyItInfo.frontCoverPageColor) { arr.push(copyItInfo.frontCoverPageColor); }
    return arr;
  }

  /**
   * Set PaperSizes
   * @param copyItInfo 
   */
  public setPaperSizes(copyItInfo: CopyItInfo): CopyItDetailPaperSizes[] {
    return this.copyItCommonService.getPaperSizes(copyItInfo);
  }

  /**
   * set paper size for estimates
   * @param middlePageSize
   */
  public getEstimatedPaperSizes(copyItInfo: CopyItInfo): CopyItDetailPaperSizes[] {
    return this.copyItCommonService.getEstimatedPaperSizes(copyItInfo);
  }

  /**
   * Set Paper Stocks
   * @param copyItInfo 
   */
  public setPaperStocks(copyItInfo: CopyItInfo): CopyItDetailPaperStocks[] {
    const arr = [];
    if (copyItInfo.frontCoverPageWeight && copyItInfo.frontCoverPageWeight.length) { arr.push(...copyItInfo.frontCoverPageWeight) }
    if (copyItInfo.middlePageWeight && copyItInfo.middlePageWeight.length) { arr.push(...copyItInfo.middlePageWeight) }
    return arr;
  }

  /**
   * Set Reproduction Types
   * @param copyItInfo 
   */
  public setReproductionTypes(copyItInfo: CopyItInfo): CopyItDetailReproductionTypes[] {
    return copyItInfo.reproductionTypes || [];
  }

  /**
   * Set Tabs
   * @param copyItInfo 
   */
  public setTabs(copyItInfo: CopyItInfo): TabResponse {
    return copyItInfo.tab || null;
  }

  /**
   * Current Asset List
   * @param value 
   */
  public currentAssetList(value: CopyItPickAsset[], isRateTypeTenant: boolean, paperSizes: CopyItDetailPaperSizes[], copyItInfo: CopyItInfo): CopyItPickAsset[] {
    const allowBWReproduction: boolean = this.copyItCommonService.checkAllowedReproductionType(copyItInfo, CopyItReproductionType.BLACK_WHITE);
    const allowColorReproduction: boolean = this.copyItCommonService.checkAllowedReproductionType(copyItInfo, CopyItReproductionType.COLOR);
    return [...value]
      .filter(asset => (allowBWReproduction && asset.bWClientConfigureDefaultId) || (allowColorReproduction && asset.colorClientConfigureDefaultId))
      .map(asset => {
        if (!asset.currentColorRead) { asset.currentColorRead = asset.previousColorRead };
        if (!asset.currentBWRead) { asset.currentBWRead = asset.previousBWRead };
        if (!asset.currentScanRead) { asset.currentScanRead = asset.previousScanRead };
        asset.chargeColorRead = this.colorMeterReadOfPaperSize(asset, paperSizes);
        asset.chargeBWRead = this.bWMeterReadOfPaperSize(asset, paperSizes);
        asset.chargeColorRate = this.assetColorRates(asset, isRateTypeTenant, paperSizes);
        asset.chargeBWRate = this.assetBWRate(asset, isRateTypeTenant, paperSizes);
        asset.paperSizeColorOptionDetail = this.paperSizeOptionDetail(asset.colorClientConfigureDefaultId, paperSizes);
        asset.paperSizeBWOptionDetail = this.paperSizeOptionDetail(asset.bWClientConfigureDefaultId, paperSizes);
        return asset;
      })
  }

  /**
   * historical Asset List
   * @param value 
   */
  public historicalAssetList(value: CopyItPickAsset[], isRateTypeTenant: boolean, paperSizes: CopyItDetailPaperSizes[], copyItInfo: CopyItInfo): CopyItPickAsset[] {
    const allowBWReproduction: boolean = this.copyItCommonService.checkAllowedReproductionType(copyItInfo, CopyItReproductionType.BLACK_WHITE);
    const allowColorReproduction: boolean = this.copyItCommonService.checkAllowedReproductionType(copyItInfo, CopyItReproductionType.COLOR);
    return [...value]
      .filter(asset => (allowBWReproduction && asset.bWClientConfigureDefaultId) || (allowColorReproduction && asset.colorClientConfigureDefaultId))
      .map(asset => {
        asset.chargeColorRead = this.colorMeterReadOfPaperSize(asset, paperSizes);
        asset.chargeBWRead = this.bWMeterReadOfPaperSize(asset, paperSizes);
        asset.chargeColorRate = this.assetColorRates(asset, isRateTypeTenant, paperSizes);
        asset.chargeBWRate = this.assetBWRate(asset, isRateTypeTenant, paperSizes);
        asset.paperSizeColorOptionDetail = this.paperSizeOptionDetail(asset.colorClientConfigureDefaultId, paperSizes);
        asset.paperSizeBWOptionDetail = this.paperSizeOptionDetail(asset.bWClientConfigureDefaultId, paperSizes);
        return asset;
      });
  }

  /**
   * color Meter ReadOf Paper Size
   * @param asset 
   * @param paperSizes 
   */
  private colorMeterReadOfPaperSize(asset: CopyItPickAsset, paperSizes: CopyItDetailPaperSizes[]): number {
    let colorPaperSideTypeId: number;
    if (asset.colorPaperSideTypeId) {
      colorPaperSideTypeId = asset.colorPaperSideTypeId;
    } else {
      const color: CopyItDetailPaperSizes = this.findPaperSizeOption(asset.colorClientConfigureDefaultId, paperSizes);
      colorPaperSideTypeId = color && color.paperSideTypeId;
    }
    let read: number = (asset.currentColorRead - asset.previousColorRead) || 0;
    if (colorPaperSideTypeId === CopyItPaperSideType.TWO_SIDED) { read = read / 2 }
    return read;
  }

  /**
   * Black & White Meter Read Of Paper Size
   * @param asset 
   * @param paperSizes 
   */
  private bWMeterReadOfPaperSize(asset: CopyItPickAsset, paperSizes: CopyItDetailPaperSizes[]): number {
    let bWPaperSideTypeId: number;
    if (asset.bWPaperSideTypeId) {
      bWPaperSideTypeId = asset.bWPaperSideTypeId;
    } else {
      const bW: CopyItDetailPaperSizes = this.findPaperSizeOption(asset.bWClientConfigureDefaultId, paperSizes,);
      bWPaperSideTypeId = bW && bW.paperSideTypeId;
    }
    let read: number = (asset.currentBWRead - asset.previousBWRead) || 0;
    if (bWPaperSideTypeId === CopyItPaperSideType.TWO_SIDED) { read = read / 2 }
    return read;
  }

  /**
   * Asset Color Rates
   * @param asset 
   * @param isRateTypeTenant 
   * @param paperSizes 
   */
  private assetColorRates(asset: CopyItPickAsset, isRateTypeTenant: boolean, paperSizes: CopyItDetailPaperSizes[]): number {
    const color: CopyItDetailPaperSizes = this.findPaperSizeOption(asset.colorClientConfigureDefaultId, paperSizes);
    const colorRate: number = color ? (isRateTypeTenant ? color.defaultTenantRate || 0 : color.defaultClientRate || 0) : 0;
    return colorRate;
  }

  /**
   * Asset BW Rate
   * @param asset 
   * @param isRateTypeTenant 
   * @param paperSizes 
   */
  private assetBWRate(asset: CopyItPickAsset, isRateTypeTenant: boolean, paperSizes: CopyItDetailPaperSizes[]): number {
    const bW: CopyItDetailPaperSizes = this.findPaperSizeOption(asset.bWClientConfigureDefaultId, paperSizes);
    const bWRate: number = bW ? (isRateTypeTenant ? bW.defaultTenantRate || 0 : bW.defaultClientRate || 0) : 0;
    return bWRate;
  }

  /**
   * Paper Size Option Detail
   * @param id 
   * @param paperSizes 
   */
  private paperSizeOptionDetail(id: number, paperSizes: CopyItDetailPaperSizes[]): any {
    return this.copyItCommonService.paperSizeOption(this.findPaperSizeOption(id, paperSizes)) || null;
  }

  /** find paper-size option details */
  private findPaperSizeOption(paperSizeId: number = 0, paperSizes: CopyItDetailPaperSizes[]): CopyItDetailPaperSizes {
    const paperSize: CopyItDetailPaperSizes = paperSizes.find((size: CopyItDetailPaperSizes) => size.clientConfigureDefaultId === paperSizeId);
    return paperSize || null;
  }
}

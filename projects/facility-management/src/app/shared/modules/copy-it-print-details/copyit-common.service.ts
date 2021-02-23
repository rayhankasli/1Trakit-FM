
/**
 * @name PrintDetailsPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for print-detailswhich contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { StatusEnum } from '../../../core/enums/status.enum';
import { getUniqueByProp } from '../../../core/utility/utility';
// ------------------------------------------------- //
import { CopyItPaperColorType, CopyItPaperSideType, CopyItReproductionType, RateRequestType } from './models/copy-it.enum';
import { CopyItDetailEnvelopes, CopyItDetailFinishings, CopyItDetailOversizedCopies, CopyItDetailPaperSizes, CopyItDetailPaperStocks, CopyItDetailReproductionTypes, TabResponse } from './models/copyit-info';
import { CopyItPickAsset } from './models/copyit-info/copyit-asset';
import { CopyItInfo } from './models/copyit-info/copyit-info';

/**
 * PrintDetailsFormPresenter
 */
@Injectable()
export class CopyitCommonService {

  constructor() { }

  /**
   * Calculate over all amount printing + attribute charges
   * @param copyItInfo CopyIt information
   */
  public calculateAttributeAndPrintingCharges(copyItInfo: CopyItInfo): number {
    let totalAmount: number = 0;
    totalAmount += this.calculatePrintingCharges(copyItInfo);
    totalAmount += this.calculateAttributeCharges(copyItInfo);
    return totalAmount;
  }

  /** it will calculate  the total rate */
  public calculateAttributeCharges(copyItInfo: CopyItInfo): number {
    let totalAmount: number = 0;
    let isClientRate: boolean = true;
    // add enum here for static value 1 and 2
    if (copyItInfo.rateRequestTypeId === RateRequestType.TENANT) {
      isClientRate = false;
    }

    totalAmount = totalAmount + this.calculateTabsAmount(copyItInfo.tab, isClientRate);
    totalAmount = totalAmount + this.calculateFinishingAmount(copyItInfo.finishings, isClientRate);
    totalAmount = totalAmount + this.calculateEnvelopesAmount(copyItInfo.envelopes, isClientRate);
    totalAmount = totalAmount + this.calculateOversizeAmount(copyItInfo.overSizedCopies, isClientRate);
    // do not consider paper-size, paper-size rates is for asset calculation.
    // removing pick asset charges
    // moved paper stock to print charges

    return +totalAmount.toFixed(4);
  }

  /**
   * For Calculate total print amount and return
   * @param copyItInfo copyit info
   */
  public calculatePrintingCharges(copyItInfo: CopyItInfo): number {
    let isClientRate: boolean = true;
    let totalAmount: number = 0;
    // add enum here for static value 1 and 2
    if (copyItInfo.rateRequestTypeId === RateRequestType.TENANT) {
      isClientRate = false;
    }

    const paperStockList: CopyItDetailPaperStocks[] = [];
    if (copyItInfo.frontCoverPageWeight && copyItInfo.frontCoverPageWeight.length) { paperStockList.push(...copyItInfo.frontCoverPageWeight) }
    if (copyItInfo.middlePageWeight && copyItInfo.middlePageWeight.length) { paperStockList.push(...copyItInfo.middlePageWeight) }
    totalAmount = totalAmount + this.calculateStockAmount(paperStockList, isClientRate);

    const statusForCharges = [StatusEnum.completed, StatusEnum.close];
    if (statusForCharges.includes(copyItInfo.copyItStatusId) && copyItInfo.pickAssets) { // calculate charges
      totalAmount = totalAmount + this.calculateMeterRead(copyItInfo, isClientRate);
    } else {  // calculate estimates
      totalAmount = totalAmount + this.calculateEstimatedMeterRead(copyItInfo, isClientRate);
    }


    return +totalAmount.toFixed(4);
  }

  /** get paper size label */
  public paperSizeOption(item: CopyItDetailPaperSizes): string {
    let opt = item && item.paperSize || null;
    if (item && item.paperColorTypeId) { opt += ` ${CopyItPaperColorType.BW === item.paperColorTypeId ? 'BW' : 'Color'}` }
    if (item && item.paperSideTypeId) { opt += ` ${CopyItPaperSideType.ONE_SIDED === item.paperSideTypeId ? '1-Sided' : '2-Sided'}` }
    if (item && item.instruction) { opt += `-${item.instruction}` }
    return opt;
  }

  /** it will calculate the total rate for reproduction type */
  private calculateTabsAmount(
    tab: TabResponse,
    isClientRate: boolean): number {
    let tabTotalAmount: number = 0;
    if (this.isValidQuantity(tab)) {
      const amount: number = isClientRate ? Number(tab.defaultClientRate || 0) * Number(tab.quantity || 0)
        : Number(tab.defaultTenantRate || 0) * Number(tab.quantity || 0);
      tabTotalAmount = tabTotalAmount + amount;
    }

    return tabTotalAmount;
  }

  /** it will calculate the total rate for finishing */
  private calculateFinishingAmount(
    finishings: CopyItDetailFinishings[],
    isClientRate: boolean): number {
    let tabTotalAmount: number = 0;
    if (finishings) {
      finishings.forEach((finishingObj: CopyItDetailFinishings) => {
        if (this.isValidQuantity(finishingObj)) {
          const amount: number = isClientRate ? Number(finishingObj.defaultClientRate || 0) * Number(finishingObj.quantity || 0)
            : Number(finishingObj.defaultTenantRate || 0) * Number(finishingObj.quantity || 0);
          tabTotalAmount = tabTotalAmount + amount;
        }
      });
    }
    return tabTotalAmount;
  }

  /** it will calculate the total rate for enevelop */
  private calculateEnvelopesAmount(
    envelopes: CopyItDetailEnvelopes[],
    isClientRate: boolean): number {
    let tabTotalAmount: number = 0;
    if (envelopes) {
      envelopes.forEach((envelopeObj: CopyItDetailEnvelopes) => {
        if (this.isValidQuantity(envelopeObj)) {
          const amount: number = isClientRate ? Number(envelopeObj.defaultClientRate || 0) * Number(envelopeObj.quantity || 0)
            : Number(envelopeObj.defaultTenantRate || 0) * Number(envelopeObj.quantity || 0);
          tabTotalAmount = tabTotalAmount + amount;
        }
      });
    }
    return tabTotalAmount;
  }

  /** it will calculate the total rate for oversize copy */
  private calculateOversizeAmount(
    overSizedCopies: CopyItDetailOversizedCopies[],
    isClientRate: boolean): number {
    let tabTotalAmount: number = 0;
    if (overSizedCopies) {
      overSizedCopies.forEach((oversizeCopyObj: CopyItDetailOversizedCopies) => {
        if (this.isValidQuantity(oversizeCopyObj)) {
          const amount: number = isClientRate ? Number(oversizeCopyObj.defaultClientRate || 0) * Number(oversizeCopyObj.quantity || 0)
            : Number(oversizeCopyObj.defaultTenantRate || 0) * Number(oversizeCopyObj.quantity || 0);
          tabTotalAmount = tabTotalAmount + amount;
        }
      });
    }
    return tabTotalAmount;
  }

  /** it will calculate the total rate for finishing */
  private calculateStockAmount(
    paperStocks: CopyItDetailPaperStocks[],
    isClientRate: boolean): number {
    let tabTotalAmount: number = 0;
    if (paperStocks) {
      paperStocks.forEach((paperStockObj: CopyItDetailPaperStocks) => {
        const amount: number = isClientRate ? Number(paperStockObj.defaultClientRate || 0) * Number(paperStockObj.quantity || 0)
          : Number(paperStockObj.defaultTenantRate || 0) * Number(paperStockObj.quantity || 0);
        tabTotalAmount = tabTotalAmount + amount;
      });
    }

    return tabTotalAmount;
  }

  /** check whehter use valid qauntity */
  private isValidQuantity(item: any): boolean {
    if (item && item['quantity'] && Number(item['quantity']) > 0) {
      return true;
    }
    return false;
  }

  /**
   * calculate estimates for the prints paper-size wise
   * @param copyItInfo CopyItInfo
   * @param isClientRate boolean
   */
  private calculateEstimatedMeterRead(copyItInfo: CopyItInfo, isClientRate: boolean): number {
    const { noOfPages, noOfCopies } = copyItInfo;
    let total: number = 0;
    const totalPages = noOfPages * noOfCopies;
    const paperSize: CopyItDetailPaperSizes[] = this.getEstimatedPaperSizes(copyItInfo);
    paperSize.forEach(paperSize => {
      const paperRate = (isClientRate ? paperSize.defaultClientRate : paperSize.defaultTenantRate) || 0;
      total += paperSize.paperSideTypeId === CopyItPaperSideType.TWO_SIDED ? ((totalPages / 2) * paperRate) : (totalPages * paperRate);
    })
    return total;
  }
  // meter-read with paper-size calculations
  /** calculate meter read */
  private calculateMeterRead(copyItInfo: CopyItInfo, isClientRate: boolean): number {
    let total: number = 0;
    const allowBWReproduction: boolean = this.checkAllowedReproductionType(copyItInfo, CopyItReproductionType.BLACK_WHITE);
    const allowColorReproduction: boolean = this.checkAllowedReproductionType(copyItInfo, CopyItReproductionType.COLOR);
    copyItInfo.pickAssets && copyItInfo.pickAssets.forEach(asset => {
      if (allowBWReproduction && asset.bWClientConfigureDefaultId) {
        total += this.getBWPaperSizeTotal(copyItInfo, asset, isClientRate);
      }
      if (allowColorReproduction && asset.colorClientConfigureDefaultId) {
        total += this.getColorPaperSizeTotal(copyItInfo, asset, isClientRate);
      }
      // const scan = isClientRate ? asset.scanTenantRate : asset.scanRate;
      // total += (asset.currentScanRead - asset.previousScanRead) * scan;
    });
    return total;
  }

  /** get BW paper-size total */
  private getBWPaperSizeTotal(copyItInfo: CopyItInfo, asset: CopyItPickAsset, isClientRate: boolean): number {
    let assetRead: number = asset.currentBWRead && (asset.currentBWRead - asset.previousBWRead);
    let paperSizeRate: number = 0;
    if (typeof (asset.bWDefaultClientRate) === 'number' && typeof (asset.bWDefaultTenantRate) === 'number') {
      paperSizeRate = (isClientRate ? asset.bWDefaultClientRate || 0 : asset.bWDefaultTenantRate || 0) || 0;
      if (asset.bWPaperSideTypeId === CopyItPaperSideType.TWO_SIDED) { assetRead = assetRead / 2; }
    } else {
      const paperSizes = this.getPaperSizes(copyItInfo);
      const bWPaperSize: CopyItDetailPaperSizes = paperSizes.find((size: CopyItDetailPaperSizes) => size.clientConfigureDefaultId === asset.bWClientConfigureDefaultId);
      paperSizeRate = bWPaperSize ? (isClientRate ? bWPaperSize.defaultClientRate || 0 : bWPaperSize.defaultTenantRate || 0) : 0;
      if (bWPaperSize && bWPaperSize.paperSideTypeId === CopyItPaperSideType.TWO_SIDED) { assetRead = assetRead / 2; }
    }
    return assetRead * paperSizeRate;
  }

  /** get Color paper-size total */
  private getColorPaperSizeTotal(copyItInfo: CopyItInfo, asset: CopyItPickAsset, isClientRate: boolean): number {
    let assetRead: number = asset.currentColorRead && (asset.currentColorRead - asset.previousColorRead);
    let paperSizeRate: number = 0;
    if (typeof (asset.colorDefaultClientRate) === 'number' && typeof (asset.colorDefaultTenantRate) === 'number') {
      paperSizeRate = (isClientRate ? asset.colorDefaultClientRate || 0 : asset.colorDefaultTenantRate || 0) || 0;
      if (asset.colorPaperSideTypeId === CopyItPaperSideType.TWO_SIDED) { assetRead = assetRead / 2; }
    } else {
      const paperSizes = this.getPaperSizes(copyItInfo);
      const colorPaperSize: CopyItDetailPaperSizes = paperSizes.find((size: CopyItDetailPaperSizes) => size.clientConfigureDefaultId === asset.colorClientConfigureDefaultId);
      paperSizeRate = colorPaperSize ? (isClientRate ? colorPaperSize.defaultClientRate || 0 : colorPaperSize.defaultTenantRate || 0) : 0;
      if (colorPaperSize && colorPaperSize.paperSideTypeId === CopyItPaperSideType.TWO_SIDED) { assetRead = assetRead / 2; }
    }
    return assetRead * paperSizeRate;
  }

  /**
   * To check if request has given reproduction type exist
   * @param reproductionTypes CopyItDetailReproductionTypes
   * @param id CopyItReproductionType
   * @returns boolean
   */
  public checkAllowedReproductionType({ reproductionTypes }: CopyItInfo, id: CopyItReproductionType): boolean {
    return reproductionTypes ? reproductionTypes.some((reproduction: CopyItDetailReproductionTypes) => reproduction.reproductionTypeId === id) : false;
  }

  /**
   * Get paper size for estimates
   * @param middlePageSize
   */
  public getEstimatedPaperSizes(copyItInfo: CopyItInfo): CopyItDetailPaperSizes[] {
    const { middlePageSize } = copyItInfo;
    const paperSize: CopyItDetailPaperSizes[] = [];
    const allowBWReproduction: boolean = this.checkAllowedReproductionType(copyItInfo, CopyItReproductionType.BLACK_WHITE);
    const allowColorReproduction: boolean = this.checkAllowedReproductionType(copyItInfo, CopyItReproductionType.COLOR);
    // ignore front Cover&Back for estimates
    if (middlePageSize) paperSize.push(middlePageSize);
    return paperSize.filter(({ paperColorTypeId }) => !paperColorTypeId ||
      (allowBWReproduction && (paperColorTypeId === CopyItReproductionType.BLACK_WHITE)) ||
      (allowColorReproduction && (paperColorTypeId === CopyItReproductionType.COLOR)));
  }

  /**
   * Get PaperSizes list. 
   * Includes frontCover&Back, middle page page size
   * @param copyItInfo 
   */
  public getPaperSizes(copyItInfo: CopyItInfo): CopyItDetailPaperSizes[] {
    const arr = [];
    if (copyItInfo.middlePageSize) arr.push(copyItInfo.middlePageSize);
    if (copyItInfo.frontCoverPageSize) arr.push(copyItInfo.frontCoverPageSize);
    return [...getUniqueByProp(arr, 'clientConfigureDefaultId')];
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// ------------------------------------------------------ //
import { CopyitCommonService } from '../../../shared/modules/copy-it-print-details/copyit-common.service';
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import {
  CopyItDetailEnvelopes, CopyItDetailFinishings, CopyItDetailOversizedCopies, CopyItDetailPaperColors,
  CopyItDetailPaperSizes, CopyItDetailPaperStocks, CopyItDetailReproductionTypes, CopyItPickAsset
} from '../../../shared/modules/copy-it-print-details/models/copyit-info';

@Injectable()
export class CopyItPrintPresenter {

  /** This is used for subscribing the value of CopyIt Info */
  public info$: Observable<CopyItInfo>;

  /** This is used for Save the CopyIt Info */
  private info: BehaviorSubject<CopyItInfo>;

  constructor(
    private copyItCommonService: CopyitCommonService
  ) {
    this.info = new BehaviorSubject(null);
    this.info$ = this.info;
  }

  /** set info */
  public setInfo(info: CopyItInfo): void {
    this.info.next(info);
  }

  /**
   * Set Envelops
   * @param envelopes Get the envelopes list
   */
  public setEnvelops(copyItInfo: CopyItInfo): string {
    return (copyItInfo.envelopes || []).map((e: CopyItDetailEnvelopes) =>
      `${e.envelope} [${e.quantity ? e.quantity : 0}]`).join(', ');
  }

  /**
   * Set Finishings
   * @param finishings 
   */
  public setFinishings(copyItInfo: CopyItInfo): string {
    return (copyItInfo.finishings || []).map((finishing: CopyItDetailFinishings) =>
      `${finishing.finishing} 
      ${finishing.finishingSubItemValue ? '-' + finishing.finishingSubItemValue : ''} 
      ${finishing.instruction ? ('-' + finishing.instruction) : ''} 
      [${finishing.quantity ? finishing.quantity : 0}]`).join(', ');
  }

  /**
   * Set OverSizedCopies
   * @param overSizedCopies 
   */
  public setOverSizedCopies(copyItInfo: CopyItInfo): string {
    return (copyItInfo.overSizedCopies || []).map((os: CopyItDetailOversizedCopies) =>
      `${os.overSizedCopy} [${os.quantity ? os.quantity : 0}]`).join(', ');
  }

  /**
   * Set PaperColors
   * @param paperColors 
   */
  public setPaperColors(copyItInfo: CopyItInfo): string {
    const arr: CopyItDetailPaperColors[] = [];
    if (copyItInfo.middlePageColor) { arr.push(copyItInfo.middlePageColor); }
    if (copyItInfo.frontCoverPageColor) { arr.push(copyItInfo.frontCoverPageColor); }
    return arr.map((color: CopyItDetailPaperColors) => `${color.color}${color.instruction ? '-'
      + color.instruction : ''} [${color.quantity ? color.quantity : 0}]`).join(', ');
  }

  /**
   * Set PaperSizes
   * @param copyItInfo 
   */
  public setPaperSizes(copyItInfo: CopyItInfo): string {
    const arr: CopyItDetailPaperSizes[] = [];
    if (copyItInfo.middlePageSize) arr.push(copyItInfo.middlePageSize);
    if (copyItInfo.frontCoverPageSize) arr.push(copyItInfo.frontCoverPageSize);
    return arr.map((size: CopyItDetailPaperSizes) => this.paperSizeOption(size)).join(', ');
  }

  /**
   * Set PaperStocks
   * @param copyItInfo 
   */
  public setPaperStocks(copyItInfo: CopyItInfo): string {
    const arr: CopyItDetailPaperStocks[] = [];
    if (copyItInfo.frontCoverPageWeight.length) { arr.push(...copyItInfo.frontCoverPageWeight) }
    if (copyItInfo.middlePageWeight.length) { arr.push(...copyItInfo.middlePageWeight) }
    return arr.map((stock: CopyItDetailPaperStocks) => `${stock.paperStock}${stock.instruction ? '-'
      + stock.instruction : ''} [${stock.quantity ? stock.quantity : 0}]`).join(', ');
  }

  /**
   * Set Reproduction Types
   * @param copyItInfo 
   */
  public setReproductionTypes(copyItInfo: CopyItInfo): string {
    return (copyItInfo.reproductionTypes || []).map((type: CopyItDetailReproductionTypes) => type.reproductionType).join(', ');
  }

  /**
   * Set Tabs
   * @param copyItInfo 
   */
  public setTabs(copyItInfo: CopyItInfo): string {
    return copyItInfo.tab ? `${copyItInfo.tab.tab}${copyItInfo.tab.instruction ? '-'
      + copyItInfo.tab.instruction : ''} [${copyItInfo.tab.quantity ? copyItInfo.tab.quantity : 0}]` : null;
  }

  /**
   * Set PickAssets
   * @param copyItInfo 
   */
  public setPickAssets(copyItInfo: CopyItInfo): CopyItPickAsset[] {
    return copyItInfo.pickAssets || [];
  }

  /**
   * Set Total Amount
   * @param copyItInfo 
   */
  public setTotalAmount(copyItInfo: CopyItInfo): number {
    if (copyItInfo) {
      return this.copyItCommonService.calculateAttributeCharges({ ...copyItInfo });
    }
  }

  /**
   * Set Total Print Amount
   * @param copyItInfo 
   */
  public setTotalPrintAmount(copyItInfo: CopyItInfo): number {
    if (copyItInfo) {
      return this.copyItCommonService.calculatePrintingCharges({ ...copyItInfo });
    }
  }

  /** get paper size label */
  private paperSizeOption(item: CopyItDetailPaperSizes): string {
    return this.copyItCommonService.paperSizeOption(item);
  }
}

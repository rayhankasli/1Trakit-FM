/**
 * @author Mitul Patel
 * @description To show total printing, total Attribute charges
 */
import { ChangeDetectionStrategy, Component, Inject, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { StatusEnum } from 'projects/facility-management/src/app/core/enums/status.enum';
import { CopyItCostType, CopyItPaperSideType, CopyItReproductionType } from 'projects/facility-management/src/app/shared/modules/copy-it-print-details/models/copy-it.enum';
// ---------------------------------------------------- //
import { DECIMAL_FORMAT } from '../../../../../core/utility/constants';
import { CopyitCommonService } from '../../../../../shared/modules/copy-it-print-details/copyit-common.service';
import {
  CopyItDetailEnvelopes, CopyItDetailFinishings, CopyItDetailOversizedCopies, CopyItDetailPaperColors,
  CopyItDetailPaperSizes, CopyItDetailPaperStocks, CopyItDetailReproductionTypes, TabResponse
} from '../../../../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyItPickAsset } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-asset';
import { CopyItInfo } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { BaseCopyitStepperPresentation } from '../../../../copyit-stepper-container/copyit-stepper-presentation/base-copyit-stepper-presentation/base-copyit-stepper.presentation';
import { RateRequestType } from '../../../../models/copy-it.enum';
import { CopyitChargesPresenter } from '../copyit-charges-presenter/copyit-charges-presenter';

@Component({
  selector: 'app-copyit-charges-ui',
  exportAs: 'copyItCharges',
  templateUrl: './copyit-charges.presentation.html',
  viewProviders: [CopyitChargesPresenter],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyItChargesPresentationComponent extends BaseCopyitStepperPresentation implements OnChanges {

  /** This will set charge type Estimates or Charges */
  @Input() public isEstimates: boolean;

  /** This will set current active data for assets */
  @Input() public set currentAssetList(value: CopyItPickAsset[]) {
    if (value && value.length) {
      if (!this.isEstimates) {
        this.currentMeterReads = [...value];
        this._currentAssetList = this.copyItChargesPresenter.currentAssetList(value, this.isRateTypeTenant, this.paperSizes, this.copyItInfo);
      }
    }
  }
  public get currentAssetList(): CopyItPickAsset[] {
    return this._currentAssetList;
  }

  // /** This will set historical data for assets */
  public set historicalAssetList(value: CopyItPickAsset[]) {
    if (value) {
      this._historicalAssetList = this.copyItChargesPresenter.historicalAssetList(value, this.isRateTypeTenant, this.paperSizes, this.copyItInfo);
    }
  }
  public get historicalAssetList(): CopyItPickAsset[] {
    return this._historicalAssetList;
  }


  /** This will set the data */
  @Input() public set copyItInfo(value: CopyItInfo) {
    if (value) {
      this._copyItInfo = { ...value };
      this.allowBWReproduction = this.copyItCommonService.checkAllowedReproductionType(this._copyItInfo, CopyItReproductionType.BLACK_WHITE);
      this.allowColorReproduction = this.copyItCommonService.checkAllowedReproductionType(this._copyItInfo, CopyItReproductionType.COLOR);
      if (!this.isEstimates) {
        this.historicalAssetList = [...this._copyItInfo.pickAssets || []];
      }
      this.isRateTypeTenant = value.rateRequestTypeId === RateRequestType.TENANT ? true : false;
      this.setCopyItInfo(value);

      // calculate charges based on selected options
      this.totalAmount = this.copyItCommonService.calculateAttributeCharges({ ...this.copyItInfo });
      this.totalPrintAmount = this.copyItCommonService.calculatePrintingCharges({ ...this.copyItInfo });
    }
  }
  public get copyItInfo(): CopyItInfo {
    return this._copyItInfo;
  }

  public get copyItCostType(): typeof CopyItCostType {
    return CopyItCostType;
  }

  public get copyItPaperSideType(): typeof CopyItPaperSideType {
    return CopyItPaperSideType;
  }

  /** current meter reads */
  public currentMeterReads: CopyItPickAsset[];
  /** Get total amount */
  public totalAmount: number;
  /** Get total Print amount */
  public totalPrintAmount: number;
  /** Rate type tenant flag */
  public isRateTypeTenant: boolean;
  /** Decimal format for showing Amounts */
  public decimal: string = DECIMAL_FORMAT;

  public allowBWReproduction: boolean;
  public allowColorReproduction: boolean;

  /** getters for copyit properties */
  public envelopes: CopyItDetailEnvelopes[];
  public finishings: CopyItDetailFinishings[];
  public overSizedCopies: CopyItDetailOversizedCopies[];
  public paperColors: CopyItDetailPaperColors[];
  public paperSizes: CopyItDetailPaperSizes[];
  public paperSizeForEstimates: CopyItDetailPaperSizes[];
  public paperStocks: CopyItDetailPaperStocks[];
  public reproductionTypes: CopyItDetailReproductionTypes[];
  public tabs: TabResponse;

  /** copyIt detail instance */
  private _copyItInfo: CopyItInfo;
  /** list of copyIt assets */
  private _currentAssetList: CopyItPickAsset[];
  /** list of historical copyIt assets */
  private _historicalAssetList: CopyItPickAsset[];

  constructor(
    private copyItCommonService: CopyitCommonService,
    private copyItChargesPresenter: CopyitChargesPresenter,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.copyItInfo = new CopyItInfo();
    this.historicalAssetList = [];
    this.currentAssetList = [];
    this.currentMeterReads = [];
    this.totalAmount = 0;
    this.totalPrintAmount = 0;
  }

  public ngOnChanges(): void {
    // to get total calculated on any of the property changes
    if (this.copyItInfo) {
      this.totalAmount = this.copyItCommonService.calculateAttributeCharges({ ...this.copyItInfo });
      this.totalPrintAmount = this.copyItCommonService.calculatePrintingCharges({ ...this.copyItInfo, ...{ pickAssets: [...[], ...this.copyItInfo.pickAssets, ...this.currentMeterReads] } });
    }
  }


  /** Set CopyIt Info */
  private setCopyItInfo(copyItInfo: CopyItInfo): void {
    this.envelopes = this.copyItChargesPresenter.setEnvelopes({ ...copyItInfo });
    this.finishings = this.copyItChargesPresenter.setFinishings({ ...copyItInfo });
    this.overSizedCopies = this.copyItChargesPresenter.setOverSizedCopies({ ...copyItInfo });
    this.paperColors = this.copyItChargesPresenter.setPaperColors({ ...copyItInfo });
    this.paperSizes = this.copyItChargesPresenter.setPaperSizes({ ...copyItInfo });
    this.paperSizeForEstimates = this.copyItChargesPresenter.getEstimatedPaperSizes({ ...copyItInfo });
    this.paperStocks = this.copyItChargesPresenter.setPaperStocks({ ...copyItInfo });
    this.reproductionTypes = this.copyItChargesPresenter.setReproductionTypes({ ...copyItInfo });
    this.tabs = this.copyItChargesPresenter.setTabs({ ...copyItInfo });
  }

}

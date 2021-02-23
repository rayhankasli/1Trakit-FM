import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
// ------------------------------------------------------------ //
import { environment } from '../../../../environments/environment';
import { BasePresentation } from '../../../core/base-classes/base.presentation';
import { LableValuePair } from '../../../core/model/common.model';
import { DATE_FORMAT, DECIMAL_FORMAT, TIME_FORMAT } from '../../../core/utility/constants';
import { CopyItSharedConfigurationService } from '../../../shared/modules/copy-it-print-details/copyit-shared-configuration.service';
import { CopyItConfiguration } from '../../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyItPickAsset } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-asset';
import { CopyItInfo } from '../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { CopyitSharedService } from '../../copyit-shared.service';
import { COPYIT_OPTION_LIST, YesNo } from '../../models/copyit-constant';
import { CopyItPrintPresenter } from '../copyit-print-presenter/copyit-print.presenter';
import { StatusEnum } from '../../../core/enums/status.enum';

/**
 * CopyIt Print Presentataion
 */
@Component({
  selector: 'app-copyit-print-presentation',
  templateUrl: './copyit-print.presentation.html',
  viewProviders: [CopyItPrintPresenter]
})
export class CopyItPrintPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** print button reference */
  @ViewChild('printBtn', { static: false }) public printBtn: ElementRef;

  /** Determines enableShipping or not */
  public enableShipping: boolean;
  /** Determines enableEnvelop or not */
  public enableEnvelop: boolean;
  /** Store the copyIt Configurations */
  public configurations: CopyItConfiguration;
  /** Store the copyit info */
  public copyItInfo: CopyItInfo;
  /** Store the active copyIt id */
  public copyItId: number;
  /** Store the Date Format constant */
  public dateFormat: string = DATE_FORMAT;
  /** Store the Time Format constant */
  public timeFormat: string = TIME_FORMAT;
  /** Store the Decimal constant */
  public decimal: string = DECIMAL_FORMAT;

  /** getters for copyit properties */
  public envelopes: string;

  /** Get the finishings Details */
  public finishings: string;

  /** Get the Over Sized Copies */
  public overSizedCopies: string;

  /** Get the Paper Colors */
  public paperColors: string;

  /** Get the Paper Sizes */
  public paperSizes: string;

  /** Get the Paper Stocks */
  public paperStocks: string;

  /** Get the Reproduction Types */
  public reproductionTypes: string;

  /** Get the Tabs */
  public tabs: string;

  /** Get the Pick Assets */
  public pickAssets: CopyItPickAsset[];

  /** Get the total amount */
  public totalAmount: number;

  /** Get the Total Print Amount */
  public totalPrintAmount: number;

  /** host path for absolute URL */
  public get host(): string {
    return environment.redirect_uri;
  }

  /** To print Yes/No for the boolean type options */
  public YesNo: any;

  /** This will set charge type Estimates or Charges */
  public isEstimates: boolean;

  /** Private Property */
  /** This proprty destroy the component */
  private destroy: Subject<void>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private copyitSharedService: CopyitSharedService,
    private copyItSharedService: CopyItSharedConfigurationService,
    private copyItPrintPresenter: CopyItPrintPresenter
  ) {
    super();
    this.destroy = new Subject();
    this.copyItId = Number(this.route.snapshot.params.id);
    this.YesNo = YesNo;
  }

  public ngOnInit(): void {
    this.route.data.pipe(map((d: any) => d['info']), takeUntil(this.destroy), switchMap((data: any) => {
      this.copyItInfo = data;
      this.setCopyItInfo(data);
      this.isEstimates = ![StatusEnum.completed, StatusEnum.close].includes(this.copyItInfo.copyItStatusId);
      return this.copyItSharedService.getCopyItConfigurations(this.copyItInfo.clientId, this.copyItId);
    })).subscribe((config: CopyItConfiguration) => {
      this.configurations = config
      this.checkRoleWiseValidation();
      this.printScreen();
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** get copyit boolean option */
  public getBoolOption(id: number = 2): string {
    const booleanOption: LableValuePair = COPYIT_OPTION_LIST.find((option: LableValuePair) => option.value === id);
    return booleanOption ? booleanOption.label : null;
  }

  /** print screen and navigate back to copyit-request */
  private printScreen(): void {
    setTimeout(() => {
      this.printBtn.nativeElement.click();
      this.location.back();
    });
  }

  /** show/hide sections based on roles and permissions */
  private checkRoleWiseValidation(): void {
    this.enableShipping = this.copyitSharedService.isEnableShipping(this.configurations.requestorSections);
    this.enableEnvelop = this.copyitSharedService.isEnableEnvelop(this.configurations.requestorSections);
  }

  /** To-Do */
  private setCopyItInfo(data: CopyItInfo): void {
    this.envelopes = this.copyItPrintPresenter.setEnvelops({ ...data });
    this.finishings = this.copyItPrintPresenter.setFinishings({ ...data });
    this.overSizedCopies = this.copyItPrintPresenter.setOverSizedCopies({ ...data });
    this.paperColors = this.copyItPrintPresenter.setPaperColors({ ...data });
    this.paperSizes = this.copyItPrintPresenter.setPaperSizes({ ...data });
    this.paperStocks = this.copyItPrintPresenter.setPaperStocks({ ...data });
    this.reproductionTypes = this.copyItPrintPresenter.setPaperSizes({ ...data });
    this.tabs = this.copyItPrintPresenter.setTabs({ ...data });
    this.pickAssets = this.copyItPrintPresenter.setPickAssets({ ...data });
    this.totalAmount = this.copyItPrintPresenter.setTotalAmount({ ...data });
    this.totalPrintAmount = this.copyItPrintPresenter.setTotalPrintAmount({ ...data });
  }

}

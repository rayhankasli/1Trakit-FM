/** 
 * @author Shahbaz Shaikh.
 * @description CopyCenterImpBAndWPresentationComponent component.
 */


import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ---------------------------------------------- //
import { SidebarService } from 'common-libs';
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
// ---------------------------------------------- //
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { ClientMaster } from '../../../../../core/model/common.model';
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { OPTIONAL_DECIMAL_FORMAT } from '../../../../../core/utility/constants';
import { CopyIMPBAndWResponse } from '../../copy-center-imp-b-and-w.model';
import { CopyCenterImpBAndWPresenter } from '../copy-center-imp-b-and-w-presenter/copy-center-imp-b-and-w.presenter';

@Component({
  selector: 'app-copy-center-imp-b-and-w-ui',
  templateUrl: './copy-center-imp-b-and-w.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [CopyCenterImpBAndWPresenter]
})
export class CopyCenterImpBAndWPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** This will set client info data */
  @Input() public set clientMaster(value: ClientMaster) {
    if (value) {
      this._clientMaster = { ...value };
    }
  }

  public get clientMaster(): ClientMaster {
    return this._clientMaster;
  }

  /** Copy Center IMP Black and White list */
  @Input() public set copyCenterIMPBAndWList(value: CopyIMPBAndWResponse[]) {
    if (value) {
      this._copyCenterIMPBAndWList = value;
      this.tableHeader = this.copyCenterImpBAndWPresenter.getTableHeader(this._copyCenterIMPBAndWList);
      this.copyCenterImpBAndWPresenter.setChartData(this._copyCenterIMPBAndWList);
      this.copyCenterImpBAndWPresenter.drawChart(this.chartContainer);
    }
  }

  public get copyCenterIMPBAndWList(): CopyIMPBAndWResponse[] {
    return this._copyCenterIMPBAndWList;
  }

  /** Event emitter set the clientId when component are initialize and change client ID. */
  @Output() public copyCenterIMPBAndW: EventEmitter<number>;

  /** Holds Element reference of the content for chart */
  @ViewChild('copyCenterIMPB&W', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;

  /** tableHeader */
  public tableHeader: string[];
  /** Current Months */
  public currentMonth: Date;
  /** client ID */
  public clientId: number;
  /** Decimal format for showing Amounts */
  public decimal: string = OPTIONAL_DECIMAL_FORMAT;

  /** This enum is return users enum props. */
  public get copyCenterImpBlackAndWhiteEnum(): typeof Permission.ReportsCopyIt {
    return Permission.ReportsCopyIt;
  }

  /** client info */
  private _clientMaster: ClientMaster;
  /** Copy Center IMP Black And White List */
  private _copyCenterIMPBAndWList: CopyIMPBAndWResponse[];
  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private coreDataService: CoreDataService,
    private sidebarService: SidebarService,
    private copyCenterImpBAndWPresenter: CopyCenterImpBAndWPresenter
  ) {
    super();
    this.destroy = new Subject();
    this.copyCenterIMPBAndW = new EventEmitter(true);
    this.currentMonth = new Date();
    this.tableHeader = [];
  }

  /** Chart Resize */
  @HostListener('window:resize', ['$event']) public onResize(): void {
    setTimeout(() => {
      this.copyCenterImpBAndWPresenter.drawChart(this.chartContainer);
    }, 500);
  }

  public ngOnInit(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) {
        this.copyCenterIMPBAndW.emit(clientId);
      } else {
        this.copyCenterIMPBAndW.emit();
      }
      this.clientId = clientId;
    });

    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe((flag: boolean) => {
      if (this._copyCenterIMPBAndWList) {
        setTimeout(() => {
          this.copyCenterImpBAndWPresenter.drawChart(this.chartContainer);
        }, 500)
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Export PDF */
  public exportAsPDF(): void {
    let clientName: string = this.clientId > 0 ? this._clientMaster.client : 'All';
    this.copyCenterImpBAndWPresenter.exportAsPDF(this._copyCenterIMPBAndWList, clientName);
  }

}
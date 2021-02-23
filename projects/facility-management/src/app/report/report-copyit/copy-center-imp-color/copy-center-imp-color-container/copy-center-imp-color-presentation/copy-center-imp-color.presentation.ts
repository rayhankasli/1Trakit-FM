/** 
 * @author Shahbaz Shaikh.
 * @description CopyCenterImpColorPresentationComponent component.
 */


import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, OnInit, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// ------------------------------------------------------- //
import { SidebarService } from 'common-libs';
// ----------------------------------------------------- //
import { BasePresentation } from '../../../../../core/base-classes/base.presentation';
import { CoreDataService } from '../../../../../core/services/core-data.service';
import { ClientMaster } from '../../../../../core/model/common.model';
import { OPTIONAL_DECIMAL_FORMAT } from '../../../../../core/utility/constants';
import { CopyIMPColorResponse } from '../../copy-center-imp-color.model';
import { Permission } from '../../../../../core/enums/role-permissions.enum';
import { CopyCenterImpColorPresenter } from '../copy-center-imp-color-presenter/copy-center-imp-color.presenter';

@Component({
  selector: 'app-copy-center-imp-color-ui',
  templateUrl: './copy-center-imp-color.presentation.html',
  preserveWhitespaces: false,
  viewProviders: [CopyCenterImpColorPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyCenterImpColorPresentationComponent extends BasePresentation implements OnInit, OnDestroy {

  /** This will set client info data */
  @Input() public set clientMaster(value: ClientMaster) {
    if (value) {
      this._clientMaster = { ...value };
    }
  }

  public get clientMaster(): ClientMaster {
    return this._clientMaster;
  }

  /** copy Center IMP Color List */
  @Input() public set copyCenterIMPColorList(value: CopyIMPColorResponse[]) {
    if (value) {
      this._copyCenterIMPColorList = value;
      this.tableHeader = this.copyCenterImpColorPresenter.getTableHeader(this._copyCenterIMPColorList);
      this.copyCenterImpColorPresenter.setChartData(this._copyCenterIMPColorList);
      this.copyCenterImpColorPresenter.drawChart(this.chartContainer)
    }
  }

  public get copyCenterIMPColorList(): CopyIMPColorResponse[] {
    return this._copyCenterIMPColorList;
  }

  /** Event emitter set the clientId when component are initialize and change client ID. */
  @Output() public copyCenterIMPColor: EventEmitter<number>;

  /** Holds Element reference of the content for chart */
  @ViewChild('copyCenterIMPColor', { static: false }) public chartContainer: ElementRef<HTMLDivElement>;

  /** tableHeader */
  public tableHeader: string[];
  /** Current Months */
  public currentMonth: Date;
  /** client ID */
  public clientId: number;
  /** Decimal format for showing Amounts */
  public decimal: string = OPTIONAL_DECIMAL_FORMAT;

  /** This enum is return users enum props. */
  public get copyCenterImpColorEnum(): typeof Permission.ReportsCopyIt {
    return Permission.ReportsCopyIt;
  }

  /** client info */
  private _clientMaster: ClientMaster;
  /** copy Center IMP Color List */
  private _copyCenterIMPColorList: CopyIMPColorResponse[];
  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private coreDataService: CoreDataService,
    private sidebarService: SidebarService,
    private copyCenterImpColorPresenter: CopyCenterImpColorPresenter
  ) {
    super();
    this.destroy = new Subject();
    this.copyCenterIMPColor = new EventEmitter(true);
    this.currentMonth = new Date();
    this.tableHeader = [];
  }

  /** Chart Resize */
  @HostListener('window:resize', ['$event']) public onResize(): void {
    setTimeout(() => {
      this.copyCenterImpColorPresenter.drawChart(this.chartContainer);
    }, 500);
  }

  public ngOnInit(): void {
    this.coreDataService.globalClientId$.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      if (clientId > 0) {
        this.copyCenterIMPColor.emit(clientId);
      } else {
        this.copyCenterIMPColor.emit();
      }
      this.clientId = clientId;
    });

    this.sidebarService.isCollapsed.pipe(takeUntil(this.destroy)).subscribe((flag: boolean) => {
      if (this._copyCenterIMPColorList) {
        setTimeout(() => {
          this.copyCenterImpColorPresenter.drawChart(this.chartContainer);
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
    this.copyCenterImpColorPresenter.exportAsPDF(this._copyCenterIMPColorList, clientName);
  }

}
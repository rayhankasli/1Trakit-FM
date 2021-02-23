/**
 * @author Rayhan Kasli
 * @description This component file loaded the data based on the client selection. 
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TableProperty } from 'common-libs';
import { ClientMaster } from 'projects/facility-management/src/app/core/model/common.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterObject, FleetDetailList, IdObject, YearList } from '../../../report-model';
import { MeterRead } from '../../report-meter-read.model';

@Component({
  selector: 'app-report-meter-read-presentation',
  templateUrl: './report-meter-read-presentation.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportMeterReadPresentationComponent implements OnInit, OnDestroy {

   /** It will store the Year List */
   @Input() public set years(list: YearList[]) {
      if (list) {
        this._years = list;
      }
    }

   public get years(): YearList[] {
      return this._years;
    }

   /** This property is used for get data from container component */
   @Input() public set baseResponse(baseResponse: MeterRead[]) {
    if (baseResponse) {
      this._baseResponse = baseResponse;
    }
  };
   public get baseResponse(): MeterRead[] {
    return this._baseResponse;
  }

  /** list of offices */
   @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = value;
    }
  }

   public get clients(): ClientMaster[] {
    return this._clients;
  }

   /** It will store the FLEET DETAIL LIST */
   @Input() public set fleetDetailList(value: FleetDetailList[]) {
      if (value) {
        this._fleetDetailList = value;
      }
    }

   public get fleetDetailList(): FleetDetailList[] {
     return this._fleetDetailList;
    }


   /** This property is used for emit data to container component */
   @Output() public getMeterRead: EventEmitter<TableProperty>;
   /** This property is used for emit data to container component */
   @Output() public getFleetDetailById: EventEmitter<IdObject>;
   /** This property is used for emit data to container component */
   @Output() public exportExcelData: EventEmitter<FilterObject>;

   /** for group for  */
   public clientId: FormControl = new FormControl();
   /** This property is used for add class host element */
   @HostBinding('class') public class: string;

  /** create for getter setter */
   private _baseResponse: MeterRead[];
  /** create for getter setter */
   private _clients: ClientMaster[];
  /** create for getter setter */
   private _years: YearList[];
  /** create for getter setter */
   private _fleetDetailList: FleetDetailList[];
   /** create for destroy */
   private destroy: Subject<boolean>;

   constructor(private cdr: ChangeDetectorRef) {
    this.getMeterRead = new EventEmitter<TableProperty>();
    this.getFleetDetailById = new EventEmitter();
    this.exportExcelData = new EventEmitter();
    this.destroy = new Subject();
    this.class = 'flex-grow-1 h-100';
    }

   public ngOnInit(): void {
    this.clientId.valueChanges.pipe(takeUntil(this.destroy)).subscribe((clientId: number) => {
      this.cdr.detectChanges();
    })
  }

   /** getMeterReads */
   public getMeterReads(tableProperty: TableProperty): void {
    this.getMeterRead.emit(tableProperty);
   }
   /** getMasterData */
   public getFleetDetail(fleetDetalis: IdObject): void {
     this.getFleetDetailById.emit(fleetDetalis);
   }
   /** export excel data */
   public exportExcel(filterObject: FilterObject): void {
    this.exportExcelData.emit(filterObject);
  }

   /** destroy */
   public ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
  
}

import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgSelectComponent, NgOption } from '@ng-select/ng-select';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { filter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators';
// ----------------------------------------------- //
import { CoreDataService } from '../../../core/services/core-data.service';
import { ClientMaster } from '../../../core/model/common.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'trakit-client-select',
  templateUrl: './client-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ClientSelectComponent,
      multi: true
    }
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClientSelectComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {

  /** this is master data object */
  @Input() public set clients(value: ClientMaster[]) {
    if (value) {
      this._clients = [...value];
      if (this._clients.length > 1) {
        this._clients.splice(0, 0, { client: 'All', clientId: -1 });
      }
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** ng-select reference */
  @ViewChild(NgSelectComponent, { static: true }) public ngSelect: NgSelectComponent;

  /** Determines whether change on */
  public onChange: Function;

  /** list of clients */
  private _clients: ClientMaster[] = [];
  /** control value */
  private selectedClientId: number;
  /** call it on destroy for unsubsubscribe the subscription */
  private destroy: Subject<void>;

  constructor(
    private cdr: ChangeDetectorRef,
    private coreDataService: CoreDataService) {
    this.destroy = new Subject<void>();
  }

  public ngOnInit(): void {
    this.ngSelect.changeEvent.pipe(
      takeUntil(this.destroy),
      filter((value: ClientMaster) => value && value.clientId !== this.selectedClientId)
    ).subscribe(
      (value: ClientMaster) => {
        this.onClientChange(value.clientId);
        this.setClientId(value.clientId);
      }
    );
  }

  public ngAfterViewInit(): void {
    this.coreDataService.globalClientId$.pipe(
      takeUntil(this.destroy),
      take(1))
      .subscribe(
        (value: number) => {
          this.onClientChange(value);
        }
      );

    let selectedItem: NgOption = this.ngSelect.itemsList.items.find((item: any) => item.value.clientId === this.selectedClientId);
    if (selectedItem) {
      this.ngSelect.select(selectedItem)
      this.cdr.detectChanges();
    }
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * Writes value overwriten
   * @param value 
   */
  public writeValue(value: number): void { }

  /**
   * Registers on change
   * @param fn 
   */
  public registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  /**
   * Registers on touched
   * @param fn 
   */
  public registerOnTouched(fn: Function): void { }

  /** when user change the client save it into core data service */
  public onClientChange(clientId: number): void {
    this.selectedClientId = clientId;
    this.onChange(clientId);
  }

  /** set the client id */
  private setClientId(clientId: number): void {
    setTimeout(() => {
      this.coreDataService.setClientId(clientId);
    }, 500);
  }
}

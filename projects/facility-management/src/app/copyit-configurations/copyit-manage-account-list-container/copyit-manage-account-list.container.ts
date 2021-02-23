

/**
 * @name CopyitManageAccountListContainerComponent
 * @author Ronak Patel.
 * @description This is a container component for CopyitConfigurations. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { AssignTo } from '../copyit-configurations.model';
import { CopyitManageAccount, CopyitManageAccounListResult } from '../models/copyit-manage-account.model';
import { CopyitConfigurationsService } from '../copyit-configurations.service';


/**
 * CopyitManageAccountListContainerComponent
 */
@Component({
  selector: 'app-copyit-manage-account-list-container',
  templateUrl: './copyit-manage-account-list.container.html'
})
export class CopyitManageAccountListContainerComponent implements OnInit, OnDestroy {
  /** hostBinding */
  @HostBinding('class') public class: string = 'flex-grow-1 h-100 overflow-hidden';

  /** This is a observable which passes the list of copyitManageAccount to its child component */
  public copyitManageAccounts$: Observable<CopyitManageAccounListResult>;
  /** This is a observable which passes the list of AssignTo Requestors to its child component */
  public assignToRequestor$: Observable<AssignTo[]>;
  /** This is a observable which passes the list of Associates to its child component */
  public assignToAssociate$: Observable<AssignTo[]>;
  /** Determines whether  deleted */
  public isDeleted: boolean;
  /** table Property */
  public tableProperty: TableProperty;
  /** client Id value */
  public clientId: number;

  /** destroy */
  private destroy: Subject<void>;

  constructor(
    private copyitConfigurationsService: CopyitConfigurationsService,
    private route: ActivatedRoute
  ) {
    this.tableProperty = new TableProperty();
    this.destroy = new Subject<void>();
  }

  public ngOnInit(): void {
    this.route.parent.params.subscribe((param: Params) => {
      this.clientId = parseInt(param.id);
    });
    this.getMasterData();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This Method is used to get data from server  */
  public getCopyitManageAccounts(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.copyitManageAccounts$ = this.copyitConfigurationsService.getCopyitManageAccounts(tableProperty, this.clientId);
  }

  /**
   * get all the required master data
   */
  public getMasterData(): void {
    this.assignToRequestor$ = this.copyitConfigurationsService.getAssignToRequestor(this.clientId);
    this.assignToAssociate$ = this.copyitConfigurationsService.getAssignToAssociate(this.clientId);
  }

  /** This Method is delete data from server  */
  public deleteCopyitManageAccount(copyitManageAccount: CopyitManageAccount): void {
    this.copyitConfigurationsService.deleteCopyitManageAccount(copyitManageAccount).pipe(takeUntil(this.destroy)).subscribe(() => {
      this.getCopyitManageAccounts(this.tableProperty);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addCopyitManageAccount(copyitManageAccount: CopyitManageAccount): void {
    this.copyitConfigurationsService.addCopyitManageAccount(copyitManageAccount, this.clientId).pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.copyitManageAccounts$ = this.copyitConfigurationsService.getCopyitManageAccounts(this.tableProperty, this.clientId);
        },
        (err: any) => {
        });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateCopyitManageAccount(copyitManageAccount: CopyitManageAccount): void {
    this.copyitConfigurationsService.updateCopyitManageAccount(copyitManageAccount, this.clientId).pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.copyitManageAccounts$ = this.copyitConfigurationsService.getCopyitManageAccounts(this.tableProperty, this.clientId);
        },
        // tslint:disable-next-line: no-any
        (err: any) => {
        });
  }


}

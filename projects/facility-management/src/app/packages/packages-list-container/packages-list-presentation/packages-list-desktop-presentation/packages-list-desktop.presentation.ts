/**
 * @author Rayhan Kasli.
 * @description This is data table desktop presentation component.To represent data in the desktop view.
 */
import { Component, ChangeDetectorRef, OnInit, OnDestroy, ViewChildren, QueryList, ChangeDetectionStrategy, EventEmitter, Output, HostBinding, NgZone, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SortingOrderDirective, SortingOrder } from 'common-libs';
//-----------------------------------------------------------------------------------------------------//
import { PackagesListPresentationBase } from '../../packages-list-presentation-base/packages-list.presentation.base';
import { PackagesListPresenter } from '../../packages-list-presenter/packages-list.presenter';
import { Packages } from '../../../packages.model';
import { Permission } from '../../../../core/enums/role-permissions.enum'
import { AuthPolicyService } from 'auth-policy';
import { ArchiveModeService } from 'projects/facility-management/src/app/core/services/archive-mode/archive-mode.service';
/**
 * PackagesListDesktopPresentationComponent
 */
@Component({
  selector: 'app-packages-list-desktop-presentation',
  templateUrl: './packages-list-desktop.presentation.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PackagesListDesktopPresentationComponent extends PackagesListPresentationBase implements OnInit, OnDestroy {


  /** This property is used for add class host element */
  @HostBinding('class') public class: string;

  /** it wil used to emit event for edit click to parent component */
  @Output() public editPackage: EventEmitter<Packages>;

  /** This property is used to store QueryList of SortingOrderDirective */
  @ViewChildren(SortingOrderDirective) public sortingColumns: QueryList<SortingOrderDirective>;

  /** This enum is return users enum props. */
  public get packagesEnum(): typeof Permission.Packages {
    return Permission.Packages;
  }


  constructor(
    public packagesPresenter: PackagesListPresenter,
    public changeDetection: ChangeDetectorRef,
    public authPolicy: AuthPolicyService,
    public archiveModeService: ArchiveModeService,
    @Inject('Window') window: Window,
    public zone: NgZone
  ) {
    super(packagesPresenter, changeDetection, authPolicy, archiveModeService, window, zone);
    this.destroy = new Subject();
    this.editPackage = new EventEmitter(true);
    this.class = 'd-flex flex-column overflow-hidden';
  }

  public ngOnInit(): void {
  }

  /**
   * This method is invoked when the user clicks on sorting icons. It sets the sort related criteria and queries the server
   * to get the updated list of packagess.
   * @param column The column on which sorting needs to be performed. 
   * @param sortingOrder The sort order by which the column needs to be sorted.
   */
  public onSortOrder(column: string, sortingOrder: SortingOrder): void {
    this.packagesPresenter.onSortOrder(column, sortingOrder, this.sortingColumns);
  }

  /**
   * when user click on edit button
   * @param user this is the visitor log object
   */
  public onEdit(packages: Packages): void {
    this.editPackage.emit(packages);
  }

  /**
   * it will hide the form on cancel
   * @param user this is the user object
   */
  public onCancel(packages?: Packages): void {
    this.packagesPresenter.cancelPackagesForm(packages);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}

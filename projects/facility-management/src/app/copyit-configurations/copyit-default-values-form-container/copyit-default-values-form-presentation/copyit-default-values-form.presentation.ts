/**
 * @name AccordionPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for accordion control which contains the ui and business logic
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AuthPolicyService } from 'auth-policy';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
// ---------------------------------------------------------------- //
import { Permission } from '../../../core/enums/role-permissions.enum';
import { CopyItConfiguration } from '../../../shared/modules/copy-it-print-details/models/copyit-info';
import { PrintDetailsFormPresentationComponent } from '../../../shared/modules/copy-it-print-details/print-details-form-presentation/print-details-form.presentation';
import { ShippingDetailsFormPresentationComponent } from '../../../shared/modules/shipping-details/shipping-details-form-presentation/shipping-details-form.presentation';
import { CopyitDefaultValues } from '../../copyit-configurations.model';
import { CopyitDefaultValuesFormPresenter } from '../copyit-default-values-form-presenter/copyit-default-values-form.presenter';
import { RequestInformationDetailsFormPresentationComponent } from './request-information-details-form-presentation/request-information-details-form.presentation';

/** 
 * CopyitDefaultValuesFormPresentationComponent  
 */
@Component({
  selector: 'app-copyit-default-values-form-ui',
  templateUrl: './copyit-default-values-form.presentation.html',
  providers: [CopyitDefaultValuesFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyitDefaultValuesFormPresentationComponent implements OnInit, AfterViewInit, OnDestroy {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex h-100 flex-column';

  /** Sets input */
  @Input() public set baseResponse(value: any) {
    if (value) {
      this._baseResponse = value;
      this.userList = value.userList;
      this.configurations = value.configurations;
      this.copyitDefaultValuesFormPresenter.setInitialDefaultValues({ ...value.defaultConfigurations });
    }
  }
  public get baseResponse(): any {
    return this._baseResponse;
  }

  /** user detail */
  @Input() public set userDetail(value: any) {
    if (value) {
      this._userDetail = value;
      this.cdr.detectChanges();
    }
  }
  public get userDetail(): any {
    return this._userDetail;
  }

  /** Save CopyIt */
  @Output() public save: EventEmitter<CopyitDefaultValues>;
  /** getUserDetail by user id */
  @Output() public getUserDetail: EventEmitter<number>;

  /** View child of copyitDefaultValuesForm presentation component   */
  @ViewChild('accordion', { static: true }) public accordionComponent: NgbAccordion;

  @ViewChild(RequestInformationDetailsFormPresentationComponent, { static: false }) public set requestComponent(ui: RequestInformationDetailsFormPresentationComponent) {
    this.copyitDefaultValuesFormPresenter.requestComponent = ui;
  };
  public get requestComponent(): RequestInformationDetailsFormPresentationComponent {
    return this.copyitDefaultValuesFormPresenter.requestComponent;
  }
  @ViewChild(PrintDetailsFormPresentationComponent, { static: false }) public set printDetailsComponent(ui: PrintDetailsFormPresentationComponent) {
    this.copyitDefaultValuesFormPresenter.printDetailsComponent = ui;
  };
  public get printDetailsComponent(): PrintDetailsFormPresentationComponent {
    return this.copyitDefaultValuesFormPresenter.printDetailsComponent;
  }
  @ViewChild(ShippingDetailsFormPresentationComponent, { static: false }) public set shippingComponent(ui: ShippingDetailsFormPresentationComponent) {
    this.copyitDefaultValuesFormPresenter.shippingComponent = ui;
  };
  public get shippingComponent(): ShippingDetailsFormPresentationComponent {
    return this.copyitDefaultValuesFormPresenter.shippingComponent;
  }

  /**
   * This enum is return copyit configuration default values enum props.
   */
  public get copyItDefaultConfigurationEnum(): typeof Permission.CopyItConfigurationDefaultValues {
    return Permission.CopyItConfigurationDefaultValues;
  }
  /** Initial active accordion ids */
  public set activeIds(ids: string[]) {
    this.copyitDefaultValuesFormPresenter.activeIds = ids;
  };
  public get activeIds(): string[] {
    return this.copyitDefaultValuesFormPresenter.activeIds;
  };

  /** flag for can user edit */
  public canEdit: boolean;
  /** Set form next event to validate and get updated data */
  public isRequestFormNext: number;
  /** Set form next event to validate and get updated data */
  public isPrintFormNext: number;
  /** Set form next event to validate and get updated data */
  public isShippingFormNext: number;
  /** it will stoe the user list */
  public userList: any[];
  /** it will store the default config value */
  public defaultValues: CopyitDefaultValues;
  /** it will store the copy it info */
  public configurations: CopyItConfiguration;

  /** current active pan */
  private currentPan: number;
  /** destroy of copyitDefaultValuesForm presentation component  */
  private destroy: Subject<void>;
  /** PrintDetails of copyit presentation component steppers print details data  */
  private _baseResponse: any;
  /** it will store the user detail */
  private _userDetail: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private authPolicyService: AuthPolicyService,
    private copyitDefaultValuesFormPresenter: CopyitDefaultValuesFormPresenter
  ) {
    this.currentPan = 0;
    this.activeIds = [this.currentPan.toString()];
    this.save = new EventEmitter<CopyitDefaultValues>();
    this.getUserDetail = new EventEmitter<number>();
    this.destroy = new Subject();

    this.canEdit = this.authPolicyService.hasPermission(this.copyItDefaultConfigurationEnum.change);
  }

  public ngOnInit(): void {
    this.copyitDefaultValuesFormPresenter.defaultValues$.pipe(takeUntil(this.destroy))
      .subscribe((defaultValues: CopyitDefaultValues) => this.defaultValues = defaultValues);
    this.copyitDefaultValuesFormPresenter.isRequestFormNext$.pipe(takeUntil(this.destroy))
      .subscribe((next: number) => this.isRequestFormNext = next);
    this.copyitDefaultValuesFormPresenter.isPrintFormNext$.pipe(takeUntil(this.destroy))
      .subscribe((next: number) => this.isPrintFormNext = next);
    this.copyitDefaultValuesFormPresenter.isShippingFormNext$.pipe(takeUntil(this.destroy))
      .subscribe((next: number) => this.isShippingFormNext = next);
    this.copyitDefaultValuesFormPresenter.saveDefaultData$.pipe(takeUntil(this.destroy)).subscribe((defaultValues: CopyitDefaultValues) => {
      this.save.emit(defaultValues);
    })
  }

  public ngAfterViewInit(): void {
    this.disableForms();
  }

  /**
   * On change of tabs, it will set the panel type according to its state
   * @param data: This is the current clicked tab
   */
  public toggleAccordion(data: NgbPanelChangeEvent): void {
  }

  /** open the panel */
  public openAccordionPanel(panelId: string): void {
    this.activeIds = [panelId];
  }

  /** close the opened panel */
  public closeAccordionPanel(panelId: string): void {
    this.activeIds = [];
  }

  /**
   * save details panel wise
   * @param panelId {string} active panel id to save data
   */
  public saveDetails(panelId: string): void {
    this.copyitDefaultValuesFormPresenter.saveDetails(panelId);
  }

  /**
   * handle submit form event
   */
  public submiteDefaultValues(): void {
    this.copyitDefaultValuesFormPresenter.submiteDefaultValues();
  }

  /**
   * get user detail by given userId
   * @param userId userId
   */
  public getUserDetailByUserId(userId: number): void {
    this.getUserDetail.emit(userId);
  }

  /** Disable accordion forms if user is not able to edit */
  private disableForms(): void {
    if (!this.canEdit) {
      setTimeout(() => {
        this.requestComponent.requestInformationDetailsFormGroup.disable();
        this.printDetailsComponent.printDetailsFormGroup.disable();
        this.shippingComponent.shippingDetailsFormGroup.disable();
      });
    }
  }

  /**
   * ngOnDestroy
   */
  // tslint:disable-next-line: member-ordering
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}

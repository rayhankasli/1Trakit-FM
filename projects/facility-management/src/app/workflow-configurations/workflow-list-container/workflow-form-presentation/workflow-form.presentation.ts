/**
 * @name WorkflowPresentationComponent
 * @author Rayhan Kasli
 * @description This is a presentation component for workflowwhich contains the ui and business logic
 */

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  Inject,
  NgZone,
} from '@angular/core';
import { FormGroup, NgControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import {
  takeUntil,
} from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { WorkflowFormPresenter } from '../workflow-form-presenter/workflow-form.presenter';
import { Workflow } from '../../workflow-configurations.model';
import {
  OfficeMaster,
  AssignedToMaster,
} from '../../../core/model/common.model';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BaseCloseSelectDropdown } from '../../../core/base-classes/base-close-select-dropdown';

/** Time format used for datePipe in timePicker */
export const TIME_FORMAT: string = 'shortTime';


/**
 * WorkflowFormPresentationComponent
 */
@Component({
  selector: '[app-workflow-form-ui]',
  templateUrl: './workflow-form.presentation.html',
  viewProviders: [WorkflowFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowFormPresentationComponent extends BaseCloseSelectDropdown implements OnInit, OnDestroy {
  /** This will set the data */
  @Input() public set workflow(value: Workflow) {
    if (value) {
      this._workflow = value;
      // this.bindTime = this.bindTimeValue(this._workflow.workflowStartTime);
      // this.showTime = this.fromModel(this._workflow.workflowStartTime);
      this.workflowFormGroup = this.workflowPresenter.bindControlValue(
        this.workflowFormGroup,
        this._workflow
      );
      // disable office on edit mode
      !this.workflow.isCreateNewCopy && this.workflowFormGroup.get('officeId').disable();
      // this.workflowFormGroup.get('workflowStartTime').setValue(this.showTime);
      this.isCancel = true;
      this.cdrRef.detectChanges();
    }
  }

  public get workflow(): Workflow {
    return this._workflow;
  }
  /** This will set the data */
  @Input() public set lastWorkflow(value: string) {
    this._lastWorkflow = value;
    this.workflowPresenter.newWorkflowId(value);
    this.buildForm();
    this.cdrRef.detectChanges();
  }

  public get lastWorkflow(): string {
    return this._lastWorkflow;
  }

  /** Sets input for office list */
  @Input() public set offices(value: OfficeMaster[]) {
    this._offices = value;
  }
  public get offices(): OfficeMaster[] {
    return this._offices;
  }

  /** Sets input */
  @Input() public set assignerList(value: AssignedToMaster[]) {
    if (value) {
      this._assigner = value;
    }
  }
  public get assignerList(): AssignedToMaster[] {
    return this._assigner;
  }

  /** Customer form group of customer form presentation component */
  public workflowFormGroup: FormGroup;

  /** ng-select dropdown reference */
  @ViewChildren(NgSelectComponent) public ngSelects: QueryList<NgSelectComponent>;


  /*** Output of customer form presentation component */
  @Output() public add: EventEmitter<Workflow>;
  /*** Output of customer form presentation component */
  @Output() public update: EventEmitter<Workflow>;
  /*** Output of customer form presentation component */
  @Output() public closeWorkflowForm: EventEmitter<boolean>;
  /** Determines whether form submitted */
  public isFormSubmitted: boolean;
  /** this property is used for time picker. */
  public isCancel: boolean;
  /** Bs config of customer form presentation component */
  public bsConfig: BsDatepickerConfig;
  public showTime: string;
  public bindTime;
  /** Date format of workflow form presentation component */
  public readonly dateFormat: string = TIME_FORMAT;


  /** Destroy of customer form presentation component */
  // public destroy: Subject<void>;
  /** Customer of customer form presentation component */
  private _workflow: Workflow;
  /** Customer of customer form presentation component */
  private _lastWorkflow: string;
  /** create for getter setter */
  private _offices: OfficeMaster[];
  /** assigner of mailConfigurations presentation component */
  private _assigner: AssignedToMaster[];
  /** This property is use to store Window object. */
  // private window: Window;

  constructor(
    private workflowPresenter: WorkflowFormPresenter,
    private cdrRef: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone)
    this.window = window as Window;
    this.initProperties();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.workflowPresenter.add$
      .pipe(takeUntil(this.destroy))
      .subscribe((workflow: Workflow) => {
        if (this.workflow) {
          workflow.isTaskCreated = this.workflow.isTaskCreated ? true : false;
          workflow.isCreateNewCopy = this.workflow.isCreateNewCopy ? true : false;
          this.workflow.isCreateNewCopy ? this.add.emit(workflow) : this.update.emit(workflow);
          this.closeForm();
        } else {
          this.add.emit(workflow);
          this.closeForm();
        }
      });

  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This is used to save the data */
  public saveWorkflow(): void {
    this.isFormSubmitted = true;
    this.workflowPresenter.saveWorkflow(this.workflowFormGroup);
  }



  /** When user click on cancel */
  public cancel(): void {
    this.closeForm();
  }

  /**
   * Closes form
   */
  public closeForm(): void {
    this.closeWorkflowForm.emit(false);
  }

  /**
   * Builds form
   */
  private buildForm(): void {
    this.workflowFormGroup = this.workflowPresenter.buildForm();
  }
  /**
   * Froms model
   * @param value   
   * @returns model 
   */
  private fromModel(value: string): any {
    if (!value) {
      return null;
    }
    const split: string[] = value.toString().split(':');
    let date = new Date();
    date.setHours(parseInt(split[0], 10));
    date.setMinutes(parseInt(split[1], 10))
    return date;
  }

  private bindTimeValue(value: string): any {
    if (!value) {
      return null;
    }
    const split: string[] = value.toString().split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: 0
    };
  }

  /** Inits properties */
  private initProperties(): void {
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.update = new EventEmitter();
    this.closeWorkflowForm = new EventEmitter();
    this.bsConfig = new BsDatepickerConfig();
    this.bsConfig.containerClass = 'theme-primary';
    this.bsConfig.adaptivePosition = true;
    this.buildForm();
  }

}

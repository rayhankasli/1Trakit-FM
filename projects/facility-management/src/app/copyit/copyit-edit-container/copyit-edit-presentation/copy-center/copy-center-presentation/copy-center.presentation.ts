/**
 * @author Mitul Patel
 * @description To show/manage copy-center details of a copyit request
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LableValuePair } from '../../../../../core/model/common.model';
import { DATE_FORMAT } from '../../../../../core/utility/constants';
import { CopyCenterInfo, CopyItInfo } from '../../../../../shared/modules/copy-it-print-details/models/copyit-info/copyit-info';
import { NgbTimePickerPipe } from '../../../../../shared/pipe/ngb-time-picker.pipe';
import { BaseCopyitStepperPresentation } from '../../../../copyit-stepper-container/copyit-stepper-presentation/base-copyit-stepper-presentation/base-copyit-stepper.presentation';
import { COPYIT_OPTION_LIST } from '../../../../models/copyit-constant';
import { CopyCenterPresenter } from '../copy-center-presenter/copy-center.presenter';

@Component({
  selector: 'app-copy-center-ui',
  exportAs: 'copyCenter',
  templateUrl: './copy-center.presentation.html',
  viewProviders: [CopyCenterPresenter],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NgbTimePickerPipe
  ]
})
export class CopyCenterPresentationComponent extends BaseCopyitStepperPresentation implements OnInit, OnDestroy {

  /** This will set the data */
  @Input() public set copyItInfo(value: CopyItInfo) {
    if (value && (JSON.stringify(value) !== JSON.stringify(this.copyItInfo))) {
      this._copyItInfo = { ...value };
      this.copyCenterPresenter.bindControlValue(this.copyCenterForm, this._copyItInfo);
      this.cd.detectChanges();
    }
  }
  public get copyItInfo(): CopyItInfo {
    return this._copyItInfo;
  }
  /** Form submitted state */
  public get isFormSubmitted(): boolean {
    return this.copyCenterPresenter.isFormSubmitted;
  }
  public get readOnlyCopyCenterForm(): CopyCenterInfo {
    return this.copyCenterForm.getRawValue();
  }

  /** copy center form instance */
  public copyCenterForm: FormGroup;
  /** drop-down options for quality */
  public readonly isQualityOptions: LableValuePair[] = COPYIT_OPTION_LIST;
  /** Date format for time picker */
  public readonly dateFormat: string = DATE_FORMAT;
  /** copyIt detail instance */
  private _copyItInfo: CopyItInfo;

  constructor(
    private copyCenterPresenter: CopyCenterPresenter,
    private cd: ChangeDetectorRef,
    @Inject('Window') window: Window,
    zone: NgZone
  ) {
    super(window, zone);
    this.destroy = new Subject();
    this.copyCenterForm = this.copyCenterPresenter.getCopyCenterForm();
    this.isQualityOptions = COPYIT_OPTION_LIST;
  }

  public ngOnInit(): void {
    this.baseNextStep$.pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.saveCopyCenterDetail();
        this.cd.detectChanges();
      });
    this.copyCenterPresenter.saveChanges$.pipe(takeUntil(this.destroy))
      .subscribe((copyItInfo: CopyItInfo) => {
        this.saveCopyItInfo.emit(copyItInfo);
      })
  }

  /** On destroy set the watcher observable to stop subscriptions */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** Save copy center details */
  private saveCopyCenterDetail(): void {
    this.copyCenterPresenter.validateForm(this.copyCenterForm, this.copyItInfo);
  }

}

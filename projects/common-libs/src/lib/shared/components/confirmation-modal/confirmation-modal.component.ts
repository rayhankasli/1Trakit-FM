/** 
 * @author Ronak Patel
 * This component create for conformation modal. 
 */
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ModalSize } from '../../../core/models/core.model';

/** Map interface */
interface ThemeMapClass {
  mainIconColor: string;
  confirm: {
    color: string;
    icon: string;
  }
}

/** Confirmation theme enum */
export enum CONFIRMATION_TYPE {
  info = 'info',
  error = 'error',
  success = 'success',
  warning = 'warning'
}

/** Confirmation theme Map */
const themeMap: Map<CONFIRMATION_TYPE, ThemeMapClass> = new Map([
  [CONFIRMATION_TYPE.error, { mainIconColor: 'icon-error text-danger', confirm: { color: 'btn-danger', icon: 'icon-delete' } }],
  [CONFIRMATION_TYPE.success, { mainIconColor: 'icon-tick text-success', confirm: { color: 'btn-success', icon: 'icon-check-circle' } }],
  [CONFIRMATION_TYPE.info, { mainIconColor: 'icon-exclamation text-info', confirm: { color: 'btn-info', icon: '' } }],
  [CONFIRMATION_TYPE.warning, { mainIconColor: 'icon-warning text-warning', confirm: { color: 'btn-warning', icon: '' } }],
]);
/**
 * ConfirmationModalComponent
 */
@Component({
  selector: 'lib-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationModalComponent {

  /**
   * Sets template ref
   */
  public set templateRef(templateRef: TemplateRef<any>) {
    if (templateRef) {
      this.viewContainerRef.createEmbeddedView(templateRef);
      this.isTemplateVisible = false;
    }
  }
  /** This property is used for get conformation modal type. */
  public set confirmationType(type: CONFIRMATION_TYPE) {
    this._confirmationType = type;
    this.theme = themeMap.get(type);
  }
  public get confirmationType(): CONFIRMATION_TYPE {
    return this._confirmationType;
  }

  /** confirmation modal theme, contains classes for theme */
  public theme: ThemeMapClass;

  /** This property is used for get conformation title. */
  public confirmationTitle: string;

  /** This property is used for get conformation message. */
  public confirmationMessage: string;

  /** This property is used for emit when user click confirm or decline button. */
  public confirmModal: Subject<boolean>;
  /**
   * Positive action of confirmation modal component
   */
  public positiveAction: string;
  /**
   * Negative action of confirmation modal component
   */
  public negativeAction: string;
  /**
   * Modal size of confirmation modal component
   */
  public modalSize: ModalSize;
  /**
   * Determines whether template visible is
   */
  public isTemplateVisible: boolean;

  /** Confirmation type instance */
  private _confirmationType: CONFIRMATION_TYPE;

  /**
   * View child of confirmation modal component
   */
  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true }) private viewContainerRef: ViewContainerRef;

  constructor() {
    this.confirmModal = new Subject<boolean>();
    this.confirmationMessage = 'Do you really want to delete this record?';
    this.positiveAction = 'Delete';
    this.negativeAction = 'Cancel';
    this.isTemplateVisible = true;
    this.modalSize = null;
    this._confirmationType = CONFIRMATION_TYPE.error
    this.theme = themeMap.get(this._confirmationType);

  }

  /** This method is invoke when user click on confirm button */
  public confirm(): void {
    this.confirmModal.next(true);
    this.confirmModal.complete();
  }

  /** This method is invoke when user click on decline button */
  public decline(): void {
    this.confirmModal.next(false);
    this.confirmModal.complete();
  }

}

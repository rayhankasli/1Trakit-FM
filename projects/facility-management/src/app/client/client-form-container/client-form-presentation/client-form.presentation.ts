

/**
 * @name ClientPresentationComponent
 * @author Enter Your Name Here
 * @description This is a presentation component for client which contains the ui and business logic
 */

import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
//-------------------------------------------------------------------------------//
import { Permission } from '../../../core/enums/role-permissions.enum';
import { ClientDetails, ClientProductLicensing } from '../../client.model';
import { ClientFormPresenter } from '../client-form-presenter/client-form.presenter';
import { PHONE_MASK, TIME_FORMAT } from '../../../core/utility/constants';

/** 
 * ClientFormPresentationComponent
 */
@Component({
  selector: 'app-client-form-ui',
  templateUrl: './client-form.presentation.html',
  viewProviders: [ClientFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientFormPresentationComponent implements OnInit, OnChanges, OnDestroy {
  /** This will set the data */
  @Input() public set client(value: ClientDetails) {
    this._client = value;
    if (value) {
      this.clientFormGroup = this.clientPresenter.bindControlValue(this.clientFormGroup, this._client);
      this.isSaveAndContinue = false;  // disable save & continue for edit
    }
  }
  public get client(): ClientDetails {
    return this._client;
  }

  /*** Output of client form presentation component */
  @Output() public add: EventEmitter<ClientDetails>;
  /*** Output of client form presentation component */
  @Output() public saveAndContinue: EventEmitter<ClientDetails>;
  /*** Output of client form presentation component */
  @Output() public update: EventEmitter<ClientDetails>;
  /*** Output of client form presentation component */
  @Output() public cancel: EventEmitter<boolean>;

  /** Customer form group of client form presentation component */
  public clientFormGroup: FormGroup;

  /** Determines whether form submitted */
  public isFormSubmitted: boolean = false;

  /** Phone number mask */
  public mask: Array<string | RegExp> = PHONE_MASK;

  /** String format for timePicker value  */
  public readonly dateFormat: string = TIME_FORMAT;

  /**
   * This enum is return clients enum props.
   */
  public get clientsEnum(): typeof Permission.Client {
    return Permission.Client;
  }
  /** Flag for managing save & continue */
  public isSaveAndContinue: boolean;

  /** Destroy of client form presentation component */
  private destroy: Subject<void>;
  /** Customer of client form presentation component */
  private _client: ClientDetails;
  /** Product licensing instance */
  private _LicensingList: ClientProductLicensing[];

  constructor(
    private clientPresenter: ClientFormPresenter,
    private zone: NgZone
  ) {
    this.destroy = new Subject();
    this.add = new EventEmitter();
    this.saveAndContinue = new EventEmitter();
    this.update = new EventEmitter();
    this.cancel = new EventEmitter();
    this.clientFormGroup = this.clientPresenter.buildForm();
    // this.isSaveAndContinue = true;  // allows to save & continue adding office
    this.clientPresenter.setFormControls(this.clientFormGroup);
  }

  public ngOnChanges(): void {
    this.beforeInitialization();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.clientPresenter.add$.pipe(takeUntil(this.destroy)).subscribe((client: ClientDetails) => {
      if (this.client) {
        this.update.emit(client);
      } else {
        this.add.emit(client);
      }
    });
    // Raise save and continue event
    this.clientPresenter.saveAndContinue$.pipe(takeUntil(this.destroy))
      .subscribe((client: ClientDetails) => this.saveAndContinue.emit(client));
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This is used to save the data */
  public saveClient(saveAndContinue: boolean = false): void {
    this.isFormSubmitted = true;
    this.clientPresenter.saveClient(this.clientFormGroup, saveAndContinue);
  }

  /** When user click on cancel */
  public cancelChanges(): void {
    this.cancel.emit(true);
  }

  /** Before Initialization */
  private beforeInitialization(): void {
    this.zone.runOutsideAngular(() => {

      this.clientFormGroup.valueChanges.pipe(takeUntil(this.destroy)).subscribe((client: ClientDetails) => {
        this.isSaveAndContinue = !this.client && (client.mail || client.workflow || client.copyIt || client.bookIt);
      });

      /** Enable/Disable SLA time for copyit, fleet */
      this.clientFormGroup.get('copyIt').valueChanges.pipe(takeUntil(this.destroy)).subscribe((flag: boolean) => {
        this.clientPresenter.enableDisableCopyItSLATime(this.clientFormGroup, flag);
      });

      /** Enable/Disable SLA time for bookit */
      this.clientFormGroup.get('bookIt').valueChanges.pipe(takeUntil(this.destroy)).subscribe((flag: boolean) => {
        this.clientPresenter.enableDisableBookItSLATime(this.clientFormGroup, flag);
      });

      /** Convert logo small to base64 */
      this.clientFormGroup.get('_logoFileNameSmall').valueChanges.pipe(takeUntil(this.destroy), map(
        (file: any) => this.clientFormGroup.get('_logoFileNameSmall').valid ? file : null)).subscribe(
          (file: any) => {
            this.clientPresenter.convertFileToBase64(file, this.clientFormGroup, 'logoSmall', 'originalLogoSmall', 'logoSmallExtension');
          });

      /** Convert logo large to base64 */
      this.clientFormGroup.get('_logoFileNameLarge').valueChanges.pipe(takeUntil(this.destroy), map(
        (file: any) => this.clientFormGroup.get('_logoFileNameLarge').valid ? file : null)
      ).subscribe((file: any) => {
        this.clientPresenter.convertFileToBase64(file, this.clientFormGroup, 'logoLarge', 'originalLogoLarge', 'logoLargeExtension');
      });

      this.clientFormGroup.get('logoSmall').valueChanges.pipe(takeUntil(this.destroy)).subscribe((path: string) => {
        this.clientFormGroup.get('_logoSmall').patchValue(path);
      });

      this.clientFormGroup.get('logoLarge').valueChanges.pipe(takeUntil(this.destroy)).subscribe((path: string) => {
        this.clientFormGroup.get('_logoLarge').patchValue(path);
      });
    });
  }
}




/**
 * @name UserProfilePresentationComponent
 * @author Nitesh Sharma
 * @description This is a presentation component for user-profilewhich contains the ui and business logic
 */

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
//-------------------------------------------------------------------------------//
import { UserProfileFormPresenter } from '../user-profile-form-presenter/user-profile-form-presenter';
import { UserProfile } from '../../../core/model/core.model';
import { PHONE_MASK } from '../../../core/utility/constants';


@Component({
  selector: 'app-user-profile-form-ui',
  templateUrl: './user-profile-form.presentation.html',
  viewProviders: [UserProfileFormPresenter],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileFormPresentationComponent implements OnInit, OnDestroy {

  /** This will set the data */
  @Input() public set userProfile(value: UserProfile) {
    if (value) {
      this._userProfile = value;
      this.userProfileForm = this.userProfilePresentor.bindControlValue(this.userProfileForm, value);
    }
  }
  public get userProfile(): UserProfile {
    return this._userProfile
  }

  /** Update user profile event */
  @Output() public update: EventEmitter<UserProfile>;

  /** User profile form */
  public userProfileForm: FormGroup;
  /** From submission state */
  public isFormSubmitted: boolean = false;
  /** phone number mask */
  public mask: any[] = PHONE_MASK;

  /** Observable destroy subject */
  private destroy: Subject<void>;
  /** User profile details */
  private _userProfile: UserProfile;

  constructor(
    private userProfilePresentor: UserProfileFormPresenter,
    private router: Router,
  ) {
    this.destroy = new Subject();
    this.update = new EventEmitter();
    this.userProfileForm = this.userProfilePresentor.buildForm();
  }

  public ngOnInit(): void {
    // This will subscribe the save event and emit to container component
    this.userProfilePresentor.update$.pipe(takeUntil(this.destroy)).subscribe((userProfile: UserProfile) => {
      this.update.emit(userProfile);
    });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /** This is used to save the data */
  public saveUser(): void {
    this.isFormSubmitted = true;
    this.userProfilePresentor.saveUserProfile(this.userProfileForm);
  }

  /** When user click on cancel */
  public onCancel(): void {
    this.router.navigate(['']);
  }

}

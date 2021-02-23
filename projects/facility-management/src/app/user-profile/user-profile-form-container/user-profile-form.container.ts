/**
 * @name UserProfileContainerComponent
 * @author Nitesh Sharma
 * @description This is a container component for UserProfile. This is responsible for all data retrieving and posting to the server by http calls.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//--------------------------------------------------------------------//
import { UserProfile } from '../../core/model/core.model';
import { UserProfileService } from '../user-profile.service';
import { UserProfileAdapter } from '../user-profile-adapter/user-profile-adapter';

@Component({
  selector: 'app-user-profile-form-container',
  templateUrl: './user-profile-form.container.html'
})
export class UserProfileFormContainerComponent implements OnInit {

  /** This is the UserProfile object to its child component */
  public userProfile: UserProfile;

  /** userId is store subject id  */
  private userId: number;


  constructor(
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private userProfileAdapter: UserProfileAdapter,
  ) {
    this.userProfile = this.userProfileAdapter.toResponse(this.route.snapshot.data['userProfile']);
    this.userId = this.userProfile.userId;
  }

  public ngOnInit(): void { }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateUserProfile(userProfile: UserProfile): void {
    this.userProfileService.updateUserProfile(this.userId, userProfile).subscribe(response => {
      // do something
    });

  }
}

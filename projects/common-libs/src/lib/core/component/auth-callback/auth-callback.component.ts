/** 
 * @author Hem Chudgar 
 */

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';
import { Router } from '@angular/router';
import { User } from 'oidc-client';
// ------------------------------------------- //
import { LoaderService } from '../../services/loader/loader.service';
import { AuthService } from '../../services/auth/auth.service';

/**
 * AuthCallbackComponent
 */
@Component({
  selector: 'lib-auth-callback',
  templateUrl: './auth-callback.component.html',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthCallbackComponent implements OnInit {


  constructor(
    private router: Router,
    private oidcFacade: OidcFacade,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {
  }

  /**
   * ngOnInit
   */
  public ngOnInit(): void {
    this.loaderService.showLoader(true);
    this.oidcFacade.getUserManager().signinRedirectCallback().then((user: User) => {
      if (user) {
        this.authService.setUserData(user);
        this.oidcFacade.getUserManager().clearStaleState();
        this.router.navigate(['/']);
      }
    }).catch((err: any) => {
      console.log(err);
      setTimeout(() => {
        this.router.navigate(['/']);
    }, 3000);
    });
  }

}

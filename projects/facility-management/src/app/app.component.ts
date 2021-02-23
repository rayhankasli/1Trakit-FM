/** 
 * @author 
 */

import { Component, AfterViewInit } from '@angular/core';
import { LoaderService, AuthService } from 'common-libs';
import { OidcFacade } from 'ng-oidc-client';
import { User } from 'oidc-client';

/** 
 * Decorator that marks a class as an Angular component and provides configuration ,
 * metadata that determines how the component should be processed, instantiated, and used at runtime. 
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements AfterViewInit {
  /** This variable hold the application title name */
  public title: string = '1TrakItDashboard';
  /** This variable hold the boolean value */
  public showLoader: boolean = false;
  constructor(
    private loaderService: LoaderService,
    private authService: AuthService,
    private oidcFacade: OidcFacade,
  ) {
    this.oidcFacade.getUserManager().getUser().then((user: User) => {
      this.authService.setUserData(user);
    });

    this.oidcFacade.getUserManager().events.addUserLoaded(() => {
      this.oidcFacade.getUserManager().getUser().then((user: User) => {
        this.authService.setUserData(user);
      });

    });
  }

  /** Invoke this lifeCycle after mount dom */
  public ngAfterViewInit(): void {
    this.loaderService.status.subscribe((val: boolean) => {
      setTimeout(
        () => {
          this.showLoader = val;
        },
        100);
    });
  }
}

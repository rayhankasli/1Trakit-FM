/**
 * @author Ronak Patel.
 */

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';

/**
 * LogoutComponent
 */
@Component({
  selector: 'lib-logout',
  templateUrl: './logout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit {

  constructor(private oidcFacade: OidcFacade) { }

  /**
   * on init
   */
  public ngOnInit(): void {
    sessionStorage.clear();
    this.oidcFacade.signoutRedirect();
  }

}

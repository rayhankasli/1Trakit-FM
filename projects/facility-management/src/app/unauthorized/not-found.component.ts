import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InactiveUser, NoLicense, NotFoundDetailModel, PageNotFound, UnauthorizedDetail } from './model';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {

  public detail: NotFoundDetailModel;

  constructor(
    private location: LocationStrategy,
    private router: Router,
  ) {
    // default unauthorized
    this.detail = UnauthorizedDetail;
  }

  public ngOnInit(): void {
    // change content based on URL
    if (this.router.url.includes('no-license')) {
      this.detail = NoLicense;
    } else if (this.router.url.includes('inactive-user')) {
      this.detail = InactiveUser;
    } else if (this.router.url.includes('page-not-found')) {
      this.detail = PageNotFound;
    }
  }

  /**
   * Logout from the application
   */
  public logout(): void {
    this.router.navigate(['logout']);
  }

  /**
   * Go back to previous route
   */
  public goBack(): void {
    this.location.back()
  }

}

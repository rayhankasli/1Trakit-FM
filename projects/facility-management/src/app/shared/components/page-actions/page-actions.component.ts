/**
 * @author: Nitesh Sharma.
 */

import {
  AfterViewInit, ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver, Injector, OnDestroy, ViewChild
} from '@angular/core';
import { CdkPortal, PortalOutlet, DomPortalOutlet } from '@angular/cdk/portal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'trackit-page-actions',
  templateUrl: './page-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PageActionsComponent implements AfterViewInit, OnDestroy {

  /** Contain CDKPortal object */
  @ViewChild(CdkPortal, { static: false }) public portal: CdkPortal;

  /** This property for store Dom Portal host */
  private portalHost: PortalOutlet;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    public cd: ChangeDetectorRef
  ) { }

  /** This method will call after render HTML page */
  public ngAfterViewInit(): void {
    this.portalHost = new DomPortalOutlet(
      document.querySelector('#page-actions-container'),
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
    this.portalHost.attach(this.portal);
  }

  /** This method for release memory  */
  public ngOnDestroy(): void {
    this.portalHost && this.portalHost.detach();
  }
  
}

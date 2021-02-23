import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ArchivedPopupPresentationComponent } from './archived-popup-presentation/archived-popup-presentation.component';
import { ComponentRef, Injectable } from '@angular/core';
import { UserInfo } from '../../model/core.model';
import { HttpService } from 'common-libs';

import { CommonHttpService } from '../../services/common-http.service';
@Injectable()
/** ArchivedService */
export class ArchivedService {

  /** This property is used to store overlayRef. */
  private overlayRef: OverlayRef;

  /** Component ref of data table presentation component */
  private componentRef: ComponentRef<ArchivedPopupPresentationComponent>;

  constructor(
    private overlay: Overlay,
    private http: HttpService,
    private commonService: CommonHttpService
  ) {}

  /** openPopUp */
  public openPopUp(moduleName: any, userInfo: UserInfo): void {
    const overlayConfig: OverlayConfig = new OverlayConfig();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = 'dark-backdrop';
    this.overlayRef = this.overlay.create(overlayConfig);
    const portal: ComponentPortal<ArchivedPopupPresentationComponent>
      = new ComponentPortal<ArchivedPopupPresentationComponent>(ArchivedPopupPresentationComponent);
    this.componentRef = this.overlayRef.attach(portal);
    this.componentRef.instance.moduleName = moduleName;  
    this.componentRef.instance.userInfo = userInfo;
    this.componentRef.instance.gotItData.subscribe((userInfo: UserInfo) => {
      if(userInfo) {
        this.commonService.updateArchivedLicensce(userInfo).subscribe((response)=>{
        });
        this.overlayRef.detach();
      }
    });    
  }
}

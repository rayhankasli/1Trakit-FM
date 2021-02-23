import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { CustomChatBoxPresentationComponent } from './custom-chat-box-presentation/custom-chat-box.presentation';

@Injectable()
export class CustomChatBoxService {

  constructor(
    private overlay: Overlay,
  ) { }

  /** Custome */
  public getComponent(): {
    componentRef: ComponentRef<CustomChatBoxPresentationComponent>;
    overlayRef: OverlayRef;
  } {
    const overlayConfig: OverlayConfig = new OverlayConfig();
    overlayConfig.hasBackdrop = true;
    overlayConfig.backdropClass = '';
    const overlayRef: OverlayRef = this.overlay.create(overlayConfig);

    // instance of conformation modal component
    const portal: ComponentPortal<CustomChatBoxPresentationComponent> =
      new ComponentPortal<CustomChatBoxPresentationComponent>(CustomChatBoxPresentationComponent);
    // attach component portal 
    const componentRef: ComponentRef<CustomChatBoxPresentationComponent> = overlayRef.attach(portal);

    return { componentRef, overlayRef };
  }
}

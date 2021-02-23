/**
 * @author Ronak Pate.
 */
import { Injectable, ComponentRef, ElementRef } from '@angular/core';
import { OidcFacade } from 'ng-oidc-client';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OverlayRef, OverlayConfig, Overlay, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
// -------------------------------------------------- //
import { TopbarService } from '../../../services/topbar/topbar.service';

/**
 * TopbarPresenter
 */
@Injectable()
export class TopbarPresenter {
    /** Property use to store sidebar collapsed state. */
    public isSideBarCollapsed: boolean;
    /** isScreenForDesktop */
    private isScreenForDesktop: boolean;
    /** Overlay ref of topbar component to create dropdown for profile options */
    private overlayRef: OverlayRef;
    constructor(
        private topbarService: TopbarService,
        private overlay: Overlay,
        private oidcFacade: OidcFacade,
        private breakpointObserver: BreakpointObserver,
        private formBuilder: FormBuilder
    ) {
        this.isSideBarCollapsed = false;
        this.topbarService.setDashboardCollapsed(this.isSideBarCollapsed)
    }

    /**
     * Builds form
     * @returns form 
     */
    public buildForm(): FormGroup {
        return this.formBuilder.group({
            selectedLanguage: ['en-us']
        });
    };

    /**
     * Change screen size
     */
    public changeScreenSize(): void {
        this.breakpointObserver.observe(['(max-width: 991px)']).subscribe((state: BreakpointState) => {
            if (state.matches) {
                this.isScreenForDesktop = false;
                this.isSideBarCollapsed = false;
                this.topbarService.setDashboardCollapsed(this.isSideBarCollapsed);
            } else {
                this.isScreenForDesktop = true;
                this.isSideBarCollapsed = false;
                this.topbarService.setDashboardCollapsed(this.isSideBarCollapsed);
            }
        });
    }

    /**
     * Configures overlay
     */
    public configureOverlay(elementRef: ElementRef, notificationUrl: string): void {
        const config: OverlayConfig = new OverlayConfig();
        config.hasBackdrop = true;
        config.backdropClass = '';
        config.positionStrategy = this.overlay.position().flexibleConnectedTo(elementRef)
            .withPositions(this.position());
        this.overlayRef = this.overlay.create(config);
        // this.showNotificationBox(notificationUrl, elementRef);
    }

    /**
     * Toggles side bar flag Is collapsed
     */
    public toggleSideBar(): void {
        if (this.isScreenForDesktop) {
            if (this.isSideBarCollapsed) {
                this.isSideBarCollapsed = false;
            } else {
                this.isSideBarCollapsed = true;
            }
            this.topbarService.setDashboardCollapsed(this.isSideBarCollapsed);
        }
    }

    /**
     * called when click on logout option
     */
    public logout(): void {
        sessionStorage.clear();
        this.oidcFacade.signoutRedirect();
    }



    /**
     * Positions topbar presenter
     * @returns position 
     */
    private position(): ConnectedPosition[] {
        const firstPosition: ConnectedPosition = {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: 25,
        }
        const secondPosition: ConnectedPosition = {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: 25,
            offsetX: 130
        }
        return [firstPosition, secondPosition];
    }

}
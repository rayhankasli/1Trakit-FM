import { Injectable, OnDestroy } from '@angular/core';
// ----------------------------------------------------- //
import { PrintDetailsFormPresentationComponent } from '../../../shared/modules/copy-it-print-details/print-details-form-presentation/print-details-form.presentation';
import { ShippingDetailsFormPresentationComponent } from '../../../shared/modules/shipping-details/shipping-details-form-presentation/shipping-details-form.presentation';
import { RequestInformationDetailsFormPresentationComponent } from '../../shared/request-information-details-form-presentation/request-information-details-form.presentation';
import { SchedulingDetailsFormPresentationComponent } from '../../shared/scheduling-details-form-presentation/scheduling-details-form.presentation';
import { CopyCenterPresentationComponent } from '../copyit-edit-presentation/copy-center/copy-center-presentation/copy-center.presentation';
import { PickAssetsPresentationComponent } from '../copyit-edit-presentation/pick-assets/pick-assets-presentation/pick-assets.presentation';


@Injectable()
export class CopyItEditViewPresenter implements OnDestroy {

    /** enable copyit form based on status */
    public disableForm: boolean;
    public requestInfoUI: RequestInformationDetailsFormPresentationComponent;
    public scheduleUI: SchedulingDetailsFormPresentationComponent;
    public printUI: PrintDetailsFormPresentationComponent;
    public shippingDetailUI: ShippingDetailsFormPresentationComponent;
    public pickAssetsUI: PickAssetsPresentationComponent;
    public copyCenterUI: CopyCenterPresentationComponent;

    constructor() { }

    public ngOnDestroy(): void { }

    /** check if active panel form is validate */
    public isPanelValid(activeId: string): boolean {
        if (this.disableForm) {
            return true;
        }
        let flag: boolean = false;
        switch (activeId) {
            case '0':
                if (this.requestInfoUI && this.requestInfoUI.requestInformationDetailsFormGroup.enabled) { flag = this.requestInfoUI.requestInformationDetailsFormGroup.valid; } else { flag = true }
                break;
            case '1':
                if (this.scheduleUI && this.scheduleUI.schedulingDetailsFormGroup.enabled) { flag = this.scheduleUI.schedulingDetailsFormGroup.valid; } else { flag = true }
                break;
            case '2':
                if (this.printUI && this.printUI.printDetailsFormGroup.enabled) { flag = this.printUI.printDetailsFormGroup.valid; } else { flag = true }
                break;
            case '3':
                if (this.shippingDetailUI && this.shippingDetailUI.shippingDetailsFormGroup.enabled) { flag = this.shippingDetailUI.shippingDetailsFormGroup.valid; } else { flag = true }
                break;
            case '4':
                if (this.pickAssetsUI && this.pickAssetsUI.copyItAssetsForm.enabled) { flag = this.pickAssetsUI.copyItAssetsForm.valid; } else { flag = true }
                break;
            case '5':
                if (this.copyCenterUI && this.copyCenterUI.copyCenterForm.enabled) { flag = this.copyCenterUI.copyCenterForm.valid; } else { flag = true }
                break;
            default:
                flag = true;
                break;
        }
        return flag;
    }

    /** validate form associate with active panel of accordion */
    public validatePanel(activeId: string): void {
        if (this.disableForm) {
            return;
        }
        switch (activeId) {
            case '0':
                if (this.requestInfoUI) { this.requestInfoUI.isNext = this.getUnique(); }
                break;
            case '1':
                if (this.scheduleUI) { this.scheduleUI.isNext = this.getUnique(); }
                break;
            case '2':
                if (this.printUI) { this.printUI.isNext = this.getUnique(); }
                break;
            case '3':
                if (this.shippingDetailUI) { this.shippingDetailUI.isNext = this.getUnique(); }
                break;
            case '4':
                if (this.pickAssetsUI) { this.pickAssetsUI.isNext = this.getUnique(); }
                break;
            case '5':
                if (this.copyCenterUI) { this.copyCenterUI.isNext = this.getUnique(); }
                break;
        }
    }

    /** to disable all form controls as whole */
    public disableAllForms(): void {
        if (this.requestInfoUI) { this.requestInfoUI.requestInformationDetailsFormGroup.disable(); }
        if (this.scheduleUI) { this.scheduleUI.schedulingDetailsFormGroup.disable(); }
        if (this.printUI) { this.printUI.printDetailsFormGroup.disable(); }
        if (this.shippingDetailUI) { this.shippingDetailUI.shippingDetailsFormGroup.disable(); }
        if (this.pickAssetsUI) {
            this.pickAssetsUI.assetListControl.disable();
            this.pickAssetsUI.copyItAssetsForm.disable();
        }
        if (this.copyCenterUI) { this.copyCenterUI.copyCenterForm.disable(); }
    }

    /** validate each panel and return first invalid panel to activate */
    public validateEachPanel(): { flag: boolean; activeIds: string[]; } {
        let activeIds: string[] = [];
        let flag: boolean = false;
        for (let panel of ['0', '1', '2', '3', '4', '5']) {
            this.validatePanel(panel);
            flag = this.isPanelValid(panel);
            if (!flag) {
                activeIds = [panel];
                break;
            }
        }
        return { flag, activeIds };
    }




    /** Get unique number */
    private getUnique(): number {
        return new Date().getMilliseconds();
    }
}
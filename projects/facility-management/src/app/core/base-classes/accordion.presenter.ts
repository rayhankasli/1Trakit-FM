/**
 * @name BaseAccordionPresenter
 * @author Mitul Patel
 * @description This is a presenter service for accordion which contains all logic for presentation component
 */
import { NgbAccordion, NgbPanel, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

/** Base class to provide consistent accordion features */
export class BaseAccordionPresenter {
    /** _activeId */
    protected _activeId: string[];

    /** primaryColor */
    protected primaryColor: string;

    constructor() {
        this._activeId = [];
        this.primaryColor = 'primary-color';
    }

    /** set and get the active id of tabs */
    public set activeIds(ids: string[]) {
        this._activeId = ids;
    }
    public get activeIds(): string[] {
        return this._activeId;
    }

    /** 
     * On change of tabs, it will set the panel type according to its state
     * @param id : This is the panel which we want to set as active
     * @param accordionComponent : This is the accordion component which have the list of panels
     */
    public toggleAccordion(data: NgbPanelChangeEvent, accordionComponent: NgbAccordion): NgbAccordion {
        if (accordionComponent.panels) {
            accordionComponent.panels.toArray().forEach((panel: NgbPanel) => {
                if (panel.id === data.panelId && data.nextState) {
                    panel.type = this.primaryColor;
                }
                else if (panel.id !== data.panelId) {
                    panel.type = '';
                }
            });
        }
        return accordionComponent;
    }

    /** 
     * This will set the PrimaryType to the active panel and remove from other panels
     * @param id : This is the panel which we want to set as active
     * @param accordionComponent : This is the accordion component which have the list of panels
     * @param isCancel : This flag is optional, only used when user click on cancel button, then remove the primary type from active tab
     */
    public setPanelPrimaryType(id: string, accordionComponent: NgbAccordion, isCancel?: boolean): NgbAccordion {
        if (accordionComponent.panels) {
            accordionComponent.panels.toArray().forEach((panel: NgbPanel) => {
                panel.type = panel.id === id ? this.primaryColor : '';
            });
        }
        return accordionComponent;
    }


    /** 
     * This will set the PrimaryType to the active panel and remove from other panels
     * @param id : This is the panel which we want to set as active
     * @param accordionComponent : This is the accordion component which have the list of panels
     * @param isCancel : This flag is optional, only used when user click on cancel button, then remove the primary type from active tab
     */
    public onCancel(id: string, accordionComponent: NgbAccordion): NgbAccordion {
        if (accordionComponent.panels) {
            this.removeActiveId(id);
            let activePanel: NgbPanel = accordionComponent.panels.toArray().find((panel: NgbPanel) => panel.id === id);
            if (activePanel) {
                this.activeIds = [];
            }
        }
        return accordionComponent;
    }

    /**
     * Remove the active panel id from activeIds list 
     * @param id : This is the panel which we want to remove from the list
     */
    public removeActiveId(id: string): void {
        const index: number = this.activeIds.indexOf(id);
        if (index > -1) {
            this.activeIds.splice(index, 1);
        }
    }
}
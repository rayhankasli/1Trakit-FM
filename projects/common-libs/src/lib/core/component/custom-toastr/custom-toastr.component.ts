import { IndividualConfig, Toast, ToastPackage, ToastrService } from 'ngx-toastr';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';

/** Custom button property */
export interface ToastButton {
    id: string;
    title: string;
};

/** Custom buttons option  */
export interface CustomIndividualConfig extends IndividualConfig {
    buttons: ToastButton[];
}

@Component({
    selector: '[toast-component]',
    templateUrl: './custom-toastr.component.html',
    animations: [
        trigger('flyInOut', [
            state('inactive', style({ opacity: 0 })),
            state('active', style({ opacity: 1 })),
            state('removed', style({ opacity: 0 })),
            transition(
                'inactive => active',
                animate('{{ easeTime }}ms {{ easing }}')
            ),
            transition(
                'active => removed',
                animate('{{ easeTime }}ms {{ easing }}')
            )
        ])
    ],
    preserveWhitespaces: false
})
export class CustomToastComponent extends Toast implements OnDestroy {

    /** Custom individual config */
    public options: CustomIndividualConfig;

    constructor(
        protected toastrService: ToastrService,
        public toastPackage: ToastPackage,
    ) {
        super(toastrService, toastPackage);
    }

    /** On action button click */
    public action(btn: ToastButton): boolean {
        event.stopPropagation();
        this.toastPackage.triggerAction(btn);
        this.toastrService.clear();
        return false;
    }
}
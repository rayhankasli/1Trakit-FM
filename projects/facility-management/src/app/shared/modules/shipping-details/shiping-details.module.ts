import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../app-shared.module';
import { ShippingDetailsFormPresentationComponent } from './shipping-details-form-presentation/shipping-details-form.presentation';

@NgModule({
    declarations: [
        ShippingDetailsFormPresentationComponent
    ],
    imports: [
        AppSharedModule,
    ],
    exports: [
        ShippingDetailsFormPresentationComponent
    ]
})
export class ShippingDetailsModule { }

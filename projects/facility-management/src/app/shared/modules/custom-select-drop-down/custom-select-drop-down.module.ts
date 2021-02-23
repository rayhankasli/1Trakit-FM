import { NgModule } from '@angular/core';
// ----------------------------------------------------------- //
import { AppSharedModule } from '../../app-shared.module';
import { CustomPageSizeDropDownComponent } from './custom-page-size-dropdown/custom-page-size-dropdown.component';
import { CustomSelectDropdownComponent } from './custom-select-dropdown/custom-select-dropdown.component';

@NgModule({
  declarations: [
    CustomSelectDropdownComponent,
    CustomPageSizeDropDownComponent,
  ],
  imports: [
    AppSharedModule
  ],
  exports: [
    CustomSelectDropdownComponent,
    CustomPageSizeDropDownComponent,
  ],
})
export class CustomSelectDropDownModule { }

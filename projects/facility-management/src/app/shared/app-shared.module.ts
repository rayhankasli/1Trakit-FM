import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDropdownModule, NgbTimeAdapter, NgbTimepickerModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TextMaskModule } from 'angular2-text-mask';
// ------------------------------------------------------------------------- //
import { NgbTimeStringAdapter, SharedModule } from 'common-libs';
// ------------------------------------------------------------------------- //
import { BsDatepickerConfig, BsDatepickerModule, BsDropdownModule, PopoverConfig, PopoverModule, TabsModule, TimepickerModule, TooltipModule } from 'ngx-bootstrap';
import { getDatepickerConfig, getPopoverConfig } from '../core/utility/utility';
import { ClientSelectComponent } from './components/client-select/client-select.component';
import { GalleryPresentationComponent } from './components/gallery/gallery-presentation/gallery-presentation.component';
import { LegendListComponent } from './components/legend-list/legend-list.component';
import { MultiSelectFilterPresentationComponent } from './components/multi-select-filter/multi-select-filter-presentation/multi-select-filter.presentation';
import { NoClientSelectedComponent } from './components/no-client-selected/no-client-selected.component';
import { PageActionsComponent } from './components/page-actions/page-actions.component';
import { ReasonsFormPresentationComponent } from './components/reasons/reasons-form-presentation/reasons-form.presentation';
import { ReasonsListDesktopPresentationComponent } from './components/reasons/reasons-list-presentation/reasons-list-desktop-presentation/reasons-list-desktop.presentation';
import { ReasonsListPresentationComponent } from './components/reasons/reasons-list-presentation/reasons-list.presentation';
import { RepeatOnPresentationComponent } from './components/repeats-on/repeat-on-presentation/repeat-on-presentation.component';
import { SearchComponent } from './components/search/search.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { DueDateTimeDirective } from './directives/due-date-time/due-date-time.directive';
import { FocusInvalidInputDirective } from './directives/focus-invalid-input/focus-invalid-input.directive';
import { OnlyNumberDirective } from './directives/only-number/only-number.directive';
import { OnlyStringDirective } from './directives/only-string/only-string.directive';
import { PreventTextDirective } from './directives/prevent-text/prevent-text.directive';
import { InputTrimDirective } from './directives/trim/trim.directive';
import { NgxPrintModule } from './modules/ngx-print/ngx-print.module';
import { NgbTimePickerPipe } from './pipe/ngb-time-picker.pipe';
import { RepeatOnDaysPipe } from './pipe/repeat-on-days.pipe';
import { SlotTimeDateFormatPipe } from './pipe/slot-time-date-format.pipe';
import { TextSearchPipe } from './pipe/text-search';
import { TimeFormatPipe } from './pipe/time-format.pipe';

@NgModule({
  declarations: [
    ReasonsListPresentationComponent,
    ReasonsFormPresentationComponent,
    ReasonsListDesktopPresentationComponent,
    TimeFormatPipe,
    NgbTimePickerPipe,
    RepeatOnPresentationComponent,
    MultiSelectFilterPresentationComponent,
    PageActionsComponent,
    OnlyNumberDirective,
    OnlyStringDirective,
    InputTrimDirective,
    SearchComponent,
    StatusBadgeComponent,
    PreventTextDirective,
    TimePickerComponent,
    ClientSelectComponent,
    DueDateTimeDirective,
    FocusInvalidInputDirective,
    LegendListComponent,
    GalleryPresentationComponent,
    NoClientSelectedComponent,
    TextSearchPipe,
    SlotTimeDateFormatPipe,
    RepeatOnDaysPipe
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngularMultiSelectModule,
    BsDropdownModule,
    NgbDropdownModule,
    PortalModule,
    OverlayModule,
    TextMaskModule,
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxPrintModule,
    NgbTimepickerModule,
    A11yModule,
    TabsModule,
    CommonModule,
    NgbTooltipModule,
    TooltipModule,
    NgbAccordionModule
  ],
  exports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    PopoverModule,
    NgSelectModule,
    PortalModule,
    OverlayModule,
    NgxPrintModule,
    ReasonsListPresentationComponent,
    ReasonsFormPresentationComponent,
    ReasonsListDesktopPresentationComponent,
    NgbDropdownModule,
    TimeFormatPipe,
    NgbTimePickerPipe,
    AngularMultiSelectModule,
    BsDropdownModule,
    RepeatOnPresentationComponent,
    PageActionsComponent,
    OnlyNumberDirective,
    OnlyStringDirective,
    InputTrimDirective,
    SearchComponent,
    StatusBadgeComponent,
    PreventTextDirective,
    TimePickerComponent,
    TextMaskModule,
    MultiSelectFilterPresentationComponent,
    ClientSelectComponent,
    DueDateTimeDirective,
    FocusInvalidInputDirective,
    LegendListComponent,
    NoClientSelectedComponent,
    TabsModule,
    NgbTimepickerModule,
    NgbTooltipModule,
    TooltipModule,
    NgbAccordionModule,
    TextSearchPipe,
    SlotTimeDateFormatPipe,
    RepeatOnDaysPipe
  ],
  providers: [
    { provide: PopoverConfig, useFactory: getPopoverConfig },
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
    { provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter },
  ],
  entryComponents: [
    RepeatOnPresentationComponent,
    GalleryPresentationComponent
  ]
})
export class AppSharedModule { }

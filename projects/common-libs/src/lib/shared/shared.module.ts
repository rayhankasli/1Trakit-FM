import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { SortingOrderDirective } from './directives/sorting/sorting-order.directive';
import { AppFileUploadComponent } from './components/app-file-upload/app-file-upload.component';
import { DecimalFormatPipe } from './pipes/decimal-format.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { NgxErrorsDirective } from './directives/ngx-errors/ngx-errors.directive';
import { NgxErrorDirective } from './directives/ngx-errors/ngx-error.directive';
import { ElapsedTimePipe } from './pipes/elapsed-time.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SubmenuComponent } from './components/submenu/submenu.component';
import { NotificationContentComponent } from './components/notification-content/notification-content.component';
import { HelpContentComponent } from './components/help-content/help-content.component';
// import { interceptorProviders } from './interceptor/interceptors';
import { FloatingLabelDirective } from './directives/floating-label/floating-label.directive';
import { AutoFocusDirective } from './directives/auto-focus/auto-focus.directive';
import { SelectFloatingLabelDirective } from './directives/select-floating-label/select-floating-label.directive';
import { PopoverFloatingLabelDirective } from './directives/popover-floating-label/popover-floating-label.directive';
import { AuthPolicyModule } from 'auth-policy';
import { AvatarComponent } from './components/avatar/avatar.component';
import { InitialsPipe } from './pipes/initials/initials.pipe';
import { CalendarFlotingLabelDirective } from './directives/calendar-floting-label/calendar-floting-label.directive';
import { DisableOnAjaxDirective } from './directives/disable-on-ajax/disable-on-ajax.directive';

/**
 * SharedModule
 */
@NgModule({
  declarations: [
    NgxErrorsDirective,
    NgxErrorDirective,
    SortingOrderDirective,
    FloatingLabelDirective,
    AutoFocusDirective,
    AppFileUploadComponent,
    DecimalFormatPipe,
    DateFormatPipe,
    ElapsedTimePipe,
    SearchPipe,
    ConfirmationModalComponent,
    SubmenuComponent,
    NotificationContentComponent,
    HelpContentComponent,
    SelectFloatingLabelDirective,
    PopoverFloatingLabelDirective,
    AvatarComponent,
    InitialsPipe,
    CalendarFlotingLabelDirective,
    DisableOnAjaxDirective
  ],
  imports: [
    CommonModule,
    ToastrModule,
    FormsModule,
    NgbAccordionModule,
    RouterModule,
    AuthPolicyModule
  ],
  exports: [
    AuthPolicyModule,
    CommonModule,
    ToastrModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAccordionModule,
    NgxErrorsDirective,
    NgxErrorDirective,
    AppFileUploadComponent,
    DecimalFormatPipe,
    DateFormatPipe,
    SortingOrderDirective,
    FloatingLabelDirective,
    AutoFocusDirective,
    ElapsedTimePipe,
    SearchPipe,
    NotificationContentComponent,
    SubmenuComponent,
    HelpContentComponent,
    SelectFloatingLabelDirective,
    CalendarFlotingLabelDirective,
    PopoverFloatingLabelDirective,
    AvatarComponent,
    InitialsPipe,
    DisableOnAjaxDirective
  ],
  entryComponents: [
    ConfirmationModalComponent,
    SubmenuComponent,
    HelpContentComponent
  ]
  // providers: [interceptorProviders]
})
export class SharedModule { }

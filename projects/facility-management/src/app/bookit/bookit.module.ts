
/**
 * @author Enter Your Name Here.
 * @description The module that handles components and services related to bookit.
 */
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'common-libs';
// ----------------------------------------------------------------- //
import { BookItRoutingModule } from './bookit-routing.module';
import { AppSharedModule } from '../shared/app-shared.module';
import { BookItPrintResolver } from './bookit-print.resolver';
import { BookItService } from './bookit.service';
import { CustomChatBoxModule } from '../shared/modules/custom-chat-box/custom-chat-box.module';
import { CustomSelectDropDownModule } from '../shared/modules/custom-select-drop-down/custom-select-drop-down.module';
import { BookItAdapter, BookItFilterRecordAdapter, BookItStatusFilterAdapter, ConversationAdapter } from './bookit-adapter/bookit.adapter';
import { BookitFormPresentationComponent } from './bookit-form-container/bookit-form-presentation/bookit-form.presentation';
import { BookitFormContainerComponent } from './bookit-form-container/bookit-form.container';
import { BookItListDesktopPresentationComponent } from './bookit-list-container/bookit-list-presentation/bookit-list-desktop-presentation/bookit-list-desktop.presentation';
import { BookItListPresentationComponent } from './bookit-list-container/bookit-list-presentation/bookit-list.presentation';
import { BookItListContainerComponent } from './bookit-list-container/bookit-list.container';
import { BookItPrintPresentationComponent } from './bookit-print-container/bookit-print-presentation/bookit-print.presentation';
import { BookitPrintContainerComponent } from './bookit-print-container/bookit-print.container';


@NgModule({
  declarations: [
    BookitFormPresentationComponent,
    BookitFormContainerComponent,
    BookItListContainerComponent,
    BookItListDesktopPresentationComponent,
    BookItListPresentationComponent,
    BookItPrintPresentationComponent,
    BookitPrintContainerComponent
  ],
  imports: [
    BookItRoutingModule,
    AppSharedModule,
    SharedModule,
    CustomSelectDropDownModule,
    CustomChatBoxModule,
  ],
  providers: [
    BookItService,
    BookItPrintResolver,
    BookItAdapter,
    ConversationAdapter,
    BookItStatusFilterAdapter,
    BookItFilterRecordAdapter,
    DatePipe
  ]
  
})
export class BookItModule {}


import { NgModule } from '@angular/core';
// ----------------------------------------------------- //
import { AppSharedModule } from '../../app-shared.module';
import { CustomChatBoxPresentationComponent } from './custom-chat-box-presentation/custom-chat-box.presentation';
import { CustomChatBoxPresenter } from './custom-chat-box-presenter/custom-chat-box-presenter';
import { CustomChatBoxService } from './custom-chat-box.service';

@NgModule({
  declarations: [
    CustomChatBoxPresentationComponent
  ],
  imports: [
    AppSharedModule
  ],
  exports: [
    CustomChatBoxPresentationComponent
  ],
  providers: [
    CustomChatBoxPresenter,
    CustomChatBoxService
  ],
  entryComponents: [
    CustomChatBoxPresentationComponent
  ],
})
export class CustomChatBoxModule { }
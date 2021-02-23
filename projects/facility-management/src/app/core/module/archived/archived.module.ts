import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// --------------------------------------------- //
import { ArchivedPopupPresentationComponent } from './archived-popup-presentation/archived-popup-presentation.component';
import { ArchivedService } from './archived.service';


@NgModule({
  declarations: [
    ArchivedPopupPresentationComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ArchivedService
  ],
  entryComponents: [
    ArchivedPopupPresentationComponent
  ]
})
export class ArchivedModule { }

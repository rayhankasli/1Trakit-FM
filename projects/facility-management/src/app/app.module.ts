/**
 * @author
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
// -------------------------------------------------------- //
import { AuthPolicyGuard, NgbTimeStringAdapter } from 'common-libs';
// -------------------------------------------------------- //
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppCoreModule } from './core/app-core.module';
import { AppSharedModule } from './shared/app-shared.module';
import { NotFoundComponent } from './unauthorized/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppCoreModule,
    AppSharedModule,
  ],
  providers: [
    { provide: 'Window', useValue: window },
    { provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter },
    { provide: AuthPolicyGuard, useClass: AuthPolicyGuard },
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }

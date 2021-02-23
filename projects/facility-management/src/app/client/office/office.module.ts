/**
 * @author Ronak Patel.
 * @description The module that handles components and services related to client.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeRoutingModule } from './office-routing.module';
import { RoomListPresentationComponent } from './floor-container/floor-list-presentation/room-list-presentation/room-list.presentation';
import { RoomFormPresentationComponent } from './floor-container/floor-list-presentation/room-list-presentation/room-form-presentation/room-form.presentation';
import { FloorContainerComponent } from './floor-container/floor.container';
import { FloorListPresentationComponent } from './floor-container/floor-list-presentation/floor-list.presentation';
import { FloorFormPresentationComponent } from './floor-container/floor-list-presentation/floor-form-presentation/floor-form.presentation';
import { OfficeContainerComponent } from './office-container/office.container';
import { OfficeListPresentationComponent } from './office-container/office-list-presentation/office-list.presentation';
import { OfficeFormPresentationComponent } from './office-container/office-list-presentation/office-form-presentation/office-form.presentation';
import { RoomAdapter, FloorAdapter, OfficeAdapter, RoomTypeAdapter, RoomLayoutMasterAdapter } from './office-adapter/office.adapter';
import { OfficeService } from './office.service';
import { SharedModule } from 'common-libs';
import { AppSharedModule } from '../../shared/app-shared.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { FloorResolver } from './floor-resolver';
import { FloorService } from './floor.service';


@NgModule({
  declarations: [
    RoomListPresentationComponent,
    RoomFormPresentationComponent,
    FloorContainerComponent,
    FloorListPresentationComponent,
    FloorFormPresentationComponent,
    OfficeContainerComponent,
    OfficeListPresentationComponent,
    OfficeFormPresentationComponent,
  ],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    SharedModule,
    AppSharedModule,
    OverlayModule,
  ],
  providers: [
    OfficeService,
    FloorService,
    RoomAdapter,
    FloorAdapter,
    OfficeAdapter,
    RoomTypeAdapter,
    RoomLayoutMasterAdapter,
    FloorResolver
  ],
  entryComponents: [
    OfficeFormPresentationComponent,
    FloorFormPresentationComponent
  ],
})
export class OfficeModule { }

import { NgModule } from '@angular/core';
// ------------------------------------------------- //
import { CostRecoveryRoutingModule } from './cost-recovery-routing.module';
import { AppSharedModule } from '../../../shared/app-shared.module';
import { CostRecoveryService } from './cost-recovery.service';
import { CostRecoveryAdapter, CostRecoveryFilterAdapter } from './cost-recovery-adapter/cost-recovery.adapter';
import { CostRecoveryContainerComponent } from './cost-recovery-container/cost-recovery.container';
import { CostRecoveryPresentationComponent } from './cost-recovery-container/cost-recovery-presentation/cost-recovery.presentation';


@NgModule({
  declarations: [
    CostRecoveryContainerComponent,
    CostRecoveryPresentationComponent,
  ],
  imports: [
    CostRecoveryRoutingModule,
    AppSharedModule
  ],
  providers: [
    CostRecoveryService,
    CostRecoveryAdapter,
    CostRecoveryFilterAdapter
  ]
})
export class CostRecoveryModule { }

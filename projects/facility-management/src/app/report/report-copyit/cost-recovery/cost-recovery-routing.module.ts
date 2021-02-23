import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ------------------------------------------------------ //
import { CostRecoveryContainerComponent } from './cost-recovery-container/cost-recovery.container';


const routes: Routes = [
  {
    path: '',
    component: CostRecoveryContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostRecoveryRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// ------------------------------------------------ //
import { TotalCopyJobsContainerComponent } from './total-copy-jobs-container/total-copy-jobs.container';


const routes: Routes = [
  {
    path: '',
    component: TotalCopyJobsContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalCopyJobsRoutingModule { }

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// ------------------------------------------------------------------------ //
import { IBreadcrumb } from './breadcrumb.shared';

export interface IPostProcessFunc {
  (crumbs: IBreadcrumb[]): Promise<IBreadcrumb[]> | Observable<IBreadcrumb[]> | IBreadcrumb[];
}

@Injectable()
export class BreadcrumbConfig {
  public postProcess: IPostProcessFunc;
}

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AuthPolicyService, PolicyData } from 'auth-policy';
import { Observable } from 'rxjs';


@Injectable()
export class AppResolverService implements Resolve<PolicyData> {
  constructor(
    private authPolicy: AuthPolicyService) { }

  resolve(
  ): Observable<PolicyData> | Promise<PolicyData> | PolicyData {
    return this.authPolicy.loadPolicyData();
  }

}

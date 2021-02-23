import { Injectable } from '@angular/core';
import { AuthPolicyService } from 'auth-policy';
// ------------------------------------------------------------- //
import { PolicyRoles } from '../core/enums/role-permissions.enum';
import { CopyItConfigRequestorSection } from '../shared/modules/copy-it-print-details/models/copyit-info';
import { AllowedRequestorSectionEnum } from './models/copy-it.enum';

@Injectable()
export class CopyitSharedService {

  constructor(
    private policyService: AuthPolicyService
  ) { }

  /** Enable/Disable shipping */
  public isEnableShipping(requestorSections: CopyItConfigRequestorSection[]): boolean {
    return this.checkRequestorEnabledOption(requestorSections, AllowedRequestorSectionEnum.SHIPPING_METHOD);
  }

  /** Enable/Disable envelop */
  public isEnableEnvelop(requestorSections: CopyItConfigRequestorSection[]): boolean {
    return this.checkRequestorEnabledOption(requestorSections, AllowedRequestorSectionEnum.ENVELOP_AND_QUANTITY);
  }

  /**
   * check requestor sections enabled/disabled against sectionId
   * @param requestorSections list of allowed requestor sections
   * @param sectionId section Id to match
   */
  private checkRequestorEnabledOption(requestorSections: CopyItConfigRequestorSection[], sectionId: number): boolean {
    const section: CopyItConfigRequestorSection = requestorSections.find((section: CopyItConfigRequestorSection) => section.requestorSectionId === sectionId);
    const isRequestor: boolean = this.policyService.isInRole(PolicyRoles.requestor)
    return isRequestor ? section ? true : false : true;
  }
}

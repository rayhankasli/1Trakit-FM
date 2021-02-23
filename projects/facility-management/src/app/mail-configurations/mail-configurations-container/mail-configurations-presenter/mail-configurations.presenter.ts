/**
 * @name MailConfigurationsAccordionPresenter
 * @author Enter Your Name Here
 * @description This is a presenter service for accordion which contains all logic for presentation component
 */

import { Injectable } from '@angular/core';
import { BaseAccordionPresenter } from '../../../core/base-classes/accordion.presenter';
import { Permission } from '../../../core/enums/role-permissions.enum';
import { ReasonPermissions, Reasons, ReasonType } from '../../../shared/components/reasons/reasons.model';


/**
 * MailConfigurationsPresenter
 */
@Injectable()
export class MailConfigurationsPresenter extends BaseAccordionPresenter {

  constructor() {
    super();
  }

  /** Set reasons permissions */
  public getReasonsPermissions(): ReasonPermissions {
    const permission: ReasonPermissions = new ReasonPermissions();
    permission.add = Permission.Reason.add;
    permission.delete = Permission.Reason.delete;
    permission.update = Permission.Reason.update;
    // permission.view = Permission.Reason.view;
    return permission;
  }

  /**
   * get list of reasons for not delivered items
   * @param reasons Reasons[]
   */
  public getNotDeliveredReasons(reasons: Reasons[]): Reasons[] {
    return reasons && reasons.filter(
      (reason: Reasons) => {
        return reason.reasonType === ReasonType.Reason_Not_Delivered;
      }
    );
  }

  /**
   * get list of reasons for not picked items
   * @param reasons Reasons[]
   */
  public getNotPickedReasons(reasons: Reasons[]): Reasons[] {
    return reasons && reasons.filter(
      (reason: Reasons) => {
        return reason.reasonType === ReasonType.Reason_Not_Picked;
      }
    );
  }
}

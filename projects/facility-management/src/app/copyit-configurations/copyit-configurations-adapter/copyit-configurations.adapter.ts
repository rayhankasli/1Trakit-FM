/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement.
 */

import { Injectable } from '@angular/core';
// -------------------------------------------- //
import { Adapter } from 'common-libs';
import { CopyItPage } from '../../shared/modules/copy-it-print-details/models/copy-it.enum';
// -------------------------------------------- //
import { CopyItConfigReproductionType, CopyItConfigTabs } from '../../shared/modules/copy-it-print-details/models/copyit-info';
import { ConfigEnvelop } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItEnvelopes';
import { CopyItFinishings } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItFinishings';
import { CopyItOversizedCopies } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItOversizedCopies';
import { CopyItPaperColors } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItPaperColors';
import { CopyItPaperSizes } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItPaperSizes';
import { CopyItPaperStocks } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItPaperStocks';
import { CopyItReproductionTypes } from '../../shared/modules/copy-it-print-details/models/copyit-info/copyItReproductionTypes';
import { CopyitDefaultValues, CopyitOptions } from '../copyit-configurations.model';
import { CopyitManageAccount, RequestCopyitManageAccount } from '../models/copyit-manage-account.model';
import { DefaultCopyItConfigurationRequest } from '../models/defaultCopyItConfigurationRequest';

/**  Injectable */
@Injectable()
export class CopyitOptionsAdapter implements Adapter<CopyitOptions> {

  /** This method is used to transform response object into T object. */
  public toResponse(response: CopyitOptions): CopyitOptions {
    const copyitOptions: CopyitOptions = new CopyitOptions(
      response.paperSizes,
      response.envelopes,
      response.paperColors,
      response.paperStocks,
      response.finishings,
      response.tabs,
      response.reproductionTypes,
      response.overSizedCopies,
      response.requestorSections,
      response.shippingServices,
    );
    return copyitOptions;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(request: CopyitOptions): CopyitOptions {
    const copyitOptions: CopyitOptions = new CopyitOptions(
      request.paperSizes,
      request.envelopes,
      request.paperColors,
      request.paperStocks,
      request.finishings,
      request.tabs,
      request.reproductionTypes,
      request.overSizedCopies,
      request.requestorSections,
      request.shippingServices,
    );
    return copyitOptions;
  }
}

/**  Injectable */
@Injectable()
export class CopyitManageAccountAdapter implements Adapter<CopyitManageAccount> {

  /** This method is used to transform response object into T object. */
  public toResponse(response: CopyitManageAccount): CopyitManageAccount {
    const copyitManageAccount: CopyitManageAccount = new CopyitManageAccount(
      response.clientAccountId,
      response.departmentName,
      response.accountNo,
      response.isActive,
      response.assignToRequestors,
      response.assignToAssociates,
    );
    return copyitManageAccount;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(request: CopyitManageAccount): CopyitManageAccount {
    const copyitManageAccount: CopyitManageAccount = new CopyitManageAccount(
      request.clientAccountId,
      request.departmentName,
      request.accountNo,
      request.isActive,
      request.assignToRequestors,
      request.assignToAssociates,
    );
    return copyitManageAccount;
  }

  /** This method is used to transform T object into request object. */
  public toUpdateRequest(item: RequestCopyitManageAccount): RequestCopyitManageAccount {
    const copyitManageAccount: RequestCopyitManageAccount = new RequestCopyitManageAccount(
      item.departmentName,
      item.accountNo,
      item.isActive,
      item.assignToRequestors,
      item.assignToAssociates,
    );

    return copyitManageAccount;
  }

  /** This method is used to transform T object into request object. */
  public toPostRequest(item: RequestCopyitManageAccount, clientId: number): RequestCopyitManageAccount {
    const copyitManageAccount: RequestCopyitManageAccount = new RequestCopyitManageAccount(
      item.departmentName,
      item.accountNo,
      item.isActive,
      item.assignToRequestors,
      item.assignToAssociates,
      clientId
    );

    return copyitManageAccount;
  }
}

/**  Injectable */
@Injectable()
export class CopyitDefaultValuesAdapter implements Adapter<CopyitDefaultValues> {
  /** This method is used to transform response object into T object. */
  public toResponse(item: CopyitDefaultValues): CopyitDefaultValues {
    const copyitDefaultValues: CopyitDefaultValues = new CopyitDefaultValues(
      item.requestForId,
      item.requestorName,
      item.emailAddress,
      item.phoneNumber,
      item.jobname,
      item.isPriceQuote,
      item.isProof,
      item.priorityId,
      item.noOfPages,
      item.noOfCopies,
      item.shippingServiceId,
      item.shippingService,
      item.shippingOptionId,
      item.shippingOptionValue,
      item.deliveredTo,
      item.paperSizes,
      item.paperColors,
      item.envelopes,
      item.paperStocks,
      item.finishings,
      item.tab,
      item.reproductionTypes,
      item.overSizedCopies,
      item.requestorSections,
      item.shippingServices
    );
    return copyitDefaultValues;
  }
  /** This method is used to transform response object into T object. */
  public toRequest(item: CopyitDefaultValues): DefaultCopyItConfigurationRequest {
    // set page color
    let paperColors: CopyItPaperColors[] = [];
    if (item.frontCoverPageColor) {
      paperColors.push({
        clientConfigureDefaultId: item.frontCoverPageColor.clientConfigureDefaultId,
        pageId: CopyItPage.FRONT_PAGE,
        pageTypeId: item.frontCoverPageType,
        instruction: item.frontCoverPageColor.instruction
      });
    }
    if (item.middlePageColor) {
      paperColors.push({
        clientConfigureDefaultId: item.middlePageColor.clientConfigureDefaultId,
        pageId: CopyItPage.MIDDLE_PAGE,
        instruction: item.middlePageColor.instruction
      });
    }

    // set page stock/weight
    const paperStocks: CopyItPaperStocks[] = [];
    if (item.frontCoverPageWeight) {
      [...item.frontCoverPageWeight].forEach((weight: CopyItPaperStocks) => paperStocks.push({
        clientConfigureDefaultId: weight.clientConfigureDefaultId,
        pageId: CopyItPage.FRONT_PAGE,
        pageTypeId: item.frontCoverPageType,
        instruction: weight.instruction
      }));
    }
    if (item.middlePageWeight) {
      [...item.middlePageWeight].forEach((weight: CopyItPaperStocks) => paperStocks.push({
        clientConfigureDefaultId: weight.clientConfigureDefaultId,
        pageId: CopyItPage.MIDDLE_PAGE,
        instruction: weight.instruction
      }));
    }

    // set paper sizes
    const paperSizes: CopyItPaperSizes[] = [];
    if (item.frontCoverPageSize) {
      paperSizes.push({
        clientConfigureDefaultId: item.frontCoverPageSize.clientConfigureDefaultId,
        pageId: CopyItPage.FRONT_PAGE,
        pageTypeId: item.frontCoverPageType,
        instruction: item.frontCoverPageSize.instruction
      });
    }
    if (item.middlePageSize) {
      paperSizes.push({
        clientConfigureDefaultId: item.middlePageSize.clientConfigureDefaultId,
        pageId: CopyItPage.MIDDLE_PAGE,
        pageTypeId: null,
        instruction: item.middlePageSize.instruction
      });
    }

    // set the envelopes
    const envelopes: ConfigEnvelop[] = [];
    if (item.envelopes) {
      item.envelopes.forEach((envelope: ConfigEnvelop) => {
        envelopes.push({
          clientConfigureDefaultId: envelope.clientConfigureDefaultId,
          quantity: envelope.quantity ? Number(envelope.quantity) : null,
          instruction: envelope.instruction
        });
      });
    }

    // set the finishings
    const finishings: CopyItFinishings[] = [];
    if (item.finishings) {
      item.finishings.forEach((finishing: CopyItFinishings) => {
        finishings.push({
          copyItFinishingId: finishing.copyItFinishingId,
          clientConfigureDefaultId: finishing.clientConfigureDefaultId,
          quantity: finishing.quantity ? Number(finishing.quantity) : null,
          finishingSubItemId: finishing.finishingSubItemId ? Number(finishing.finishingSubItemId) : null,
          instruction: finishing.instruction
        });
      });
    }

    // set the reproductionTypes
    const reproductionTypes: CopyItReproductionTypes[] = [];
    if (item.reproductionTypes) {
      item.reproductionTypes.forEach((reproductionType: CopyItConfigReproductionType) => {
        reproductionTypes.push({
          clientConfigureDefaultId: reproductionType.clientConfigureDefaultId,
          instruction: reproductionType.instruction,
          reproductionTypeId: reproductionType.reproductionTypeId
        });
      });
    }

    // set the tab
    let tab: CopyItConfigTabs;
    if (item.tab) {
      tab = {
        clientConfigureDefaultId: item.tab.clientConfigureDefaultId,
        tabId: item.tab.tabId,
        instruction: item.tab.instruction
      }
    }

    // set the oversizedCopy
    const overSizedCopies: CopyItOversizedCopies[] = [];
    if (item.overSizedCopies) {
      item.overSizedCopies.forEach((overSizedCopy: CopyItOversizedCopies) => {
        overSizedCopies.push({
          copyItOverSizedCopyId: overSizedCopy.copyItOverSizedCopyId,
          clientConfigureDefaultId: overSizedCopy.clientConfigureDefaultId,
          // quantity: overSizedCopy.quantity ? Number(overSizedCopy.quantity) : null,
          instruction: overSizedCopy.instruction
        });
      });
    }

    return new DefaultCopyItConfigurationRequest(
      item.requestForId,
      item.emailAddress,
      item.phoneNumber,
      item.jobname,
      item.isPriceQuote === 1 ? true : false,
      item.isProof === 1 ? true : false,
      item.priorityId,
      item.noOfPages,
      item.noOfCopies,
      item.shippingServiceId,
      item.shippingOptionId,
      item.shippingOptionValue,
      item.deliveredTo,
      paperSizes,
      paperColors,
      envelopes,
      paperStocks,
      finishings,
      tab,
      reproductionTypes,
      overSizedCopies,
      item.requestorSections,
      item.shippingServices
    );
  }
}


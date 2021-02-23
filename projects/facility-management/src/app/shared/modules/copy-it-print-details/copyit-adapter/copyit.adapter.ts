

/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement.
 */

import { Injectable } from '@angular/core';
// ------------------------------------------------------- //
import { Adapter } from 'common-libs';
import { isBoolean } from 'util';
// ------------------------------------------------------- //
import { environment } from '../../../../../environments/environment';
import { getLocaleDateTime, getLocaleTime } from '../../../../core/utility/utility';
import { CopyItPage } from '../models/copy-it.enum';
import { ClientOverSizedCopy, ConfigEnvelop, CopyItDetailPaperSizes, CopyItDetailPaperStocks, DefaultCopyItConfiguration, DefaultCopyItConfigurationResponse } from '../models/copyit-info';
import { CopyItInfo } from '../models/copyit-info/copyit-info';
import { CopyItConfigEnvelop } from '../models/copyit-info/copyitConfigEnvelop';
import { CopyItConfigFinishing } from '../models/copyit-info/copyitConfigFinishing';
import { CopyItConfigOverSizedCopy } from '../models/copyit-info/copyitConfigOverSizeCopies';
import { ClientPaperColor, CopyItConfigPaperColor } from '../models/copyit-info/copyitConfigPaperColor';
import { ClientPaperSizes, CopyItConfigPaperSizes } from '../models/copyit-info/copyItConfigPaperSizes';
import { CopyItConfigPaperStock } from '../models/copyit-info/copyitConfigPaperStocks';
import { CopyItConfigReproductionType } from '../models/copyit-info/copyitConfigReproductionType';
import { CopyItConfigRequestorSection } from '../models/copyit-info/copyitConfigRequestorSection';
import { CopyItConfigShippingMethod } from '../models/copyit-info/copyitConfigShippingMethod';
import { CopyItConfigTabs } from '../models/copyit-info/copyitConfigTabs';
import { CopyItDetailFinishings, CopyItFinishings } from '../models/copyit-info/copyItFinishings';
import { CopyItDetailPaperColors, CopyItPaperColors } from '../models/copyit-info/copyItPaperColors';
import { CopyItRequest } from '../models/copyit-info/copyItRequest';
import { CopyItResponse } from '../models/copyit-info/copyItResponse';
import { FileResponse } from '../models/copyit-info/fileResponse';


@Injectable()
export class CopyItConfigAdapter {
  /** This method is used to transform response object into T object. */
  public paperSize(item: ClientPaperSizes): CopyItConfigPaperSizes {
    const clientInfo: CopyItConfigPaperSizes = new CopyItConfigPaperSizes(
      item.clientConfigureDefaultId,
      item.paperSizeColorSideId,
      item.paperSizeId,
      item.paperSize,
      item.priority,
      item.isOther,
      item.paperColorTypeId,
      item.paperColor,
      item.paperSideTypeId,
      item.paperSide,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return clientInfo;
  }

  /** This method is used to transform response object into T object. */
  public paperColor(item: ClientPaperColor): CopyItConfigPaperColor {
    const copyItInfo: CopyItConfigPaperColor = new CopyItConfigPaperColor(
      item.clientConfigureDefaultId,
      item.colorId,
      item.color,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return copyItInfo;
  }

  /** This method is used to transform response object into T object. */
  public envelop(item: ConfigEnvelop): CopyItConfigEnvelop {
    const copyItInfo: CopyItConfigEnvelop = new CopyItConfigEnvelop(
      item.clientConfigureDefaultId,
      item.envelopeId,
      item.envelope,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction,
    );
    return copyItInfo;
  }

  /** This method is used to transform response object into T object. */
  public paperStock(item: CopyItConfigPaperStock): CopyItConfigPaperStock {
    const copyItInfo: CopyItConfigPaperStock = new CopyItConfigPaperStock(
      item.clientConfigureDefaultId,
      item.paperStockId,
      item.paperStock,
      item.isOther,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return copyItInfo;
  }

  /** This method is used to transform response object into T object. */
  public finishing(item: CopyItConfigFinishing): CopyItConfigFinishing {
    const copyItInfo: CopyItConfigFinishing = new CopyItConfigFinishing(
      item.clientConfigureDefaultId,
      item.finishingId,
      item.finishing,
      item.isOther,
      item.finishingSubItems,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return copyItInfo;
  }

  /** This method is used to transform response object into T object. */
  public tabs(item: CopyItConfigTabs): CopyItConfigTabs {
    const copyItInfo: CopyItConfigTabs = new CopyItConfigTabs(
      item.clientConfigureDefaultId,
      item.tabId,
      item.tab,
      item.isOther,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return copyItInfo;
  }

  /** This method is used to transform response object into T object. */
  public reproductionType(item: CopyItConfigReproductionType): CopyItConfigReproductionType {
    const copyItInfo: CopyItConfigReproductionType = new CopyItConfigReproductionType(
      item.clientConfigureDefaultId,
      item.reproductionTypeId,
      item.reproductionType,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return copyItInfo;
  }

  /** This method is used to transform response object into T object. */
  public overSizedCopy(item: ClientOverSizedCopy): CopyItConfigOverSizedCopy {
    const copyItInfo: CopyItConfigOverSizedCopy = new CopyItConfigOverSizedCopy(
      item.clientConfigureDefaultId,
      item.overSizedCopyId,
      item.overSizedCopy,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return copyItInfo;
  }

  /** This method is used to transform response object into T object. */
  public requestorSection(item: CopyItConfigRequestorSection): CopyItConfigRequestorSection {
    const copyItInfo: CopyItConfigRequestorSection = new CopyItConfigRequestorSection(
      item.clientConfigureDefaultId,
      item.requestorSectionId,
      item.requestorSection,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return copyItInfo;
  }

  /** This method is used to transform response object into T object. */
  public shippingMethod(item: CopyItConfigShippingMethod): CopyItConfigShippingMethod {
    const copyItInfo: CopyItConfigShippingMethod = new CopyItConfigShippingMethod(
      item.clientConfigureDefaultId,
      item.shippingServiceId,
      item.shippingService,
      item.defaultClientRate,
      item.defaultTenantRate,
      item.isDefault,
      item.quantity,
      item.instruction
    );
    return copyItInfo;
  }
}

@Injectable()
export class CopyItInfoAdapter implements Adapter<CopyItInfo>{

  /** This method is used to transform response object into T object. */
  public toResponse(item: CopyItResponse): CopyItInfo {
    const copyItInfo: CopyItInfo = new CopyItInfo();
    this.setRequestInfoForResponse(item, copyItInfo);
    this.setSchedulingInfoForResponse(item, copyItInfo);
    this.setShippingInfoForResponse(item, copyItInfo);
    this.setPrintingInfoForResponse(item, copyItInfo);
    this.setCopyCenterInfoForResponse(item, copyItInfo);

    /** filter and set list of file names */
    copyItInfo.fileName = []; //item.files.map((file: FileResponse) => file.actualFileName);

    return copyItInfo;
  }

  /** get finishing items */
  public getFinishingItem(finishingList: CopyItDetailFinishings[]): CopyItFinishings[] {
    const finishings: CopyItFinishings[] = [];
    if (finishingList) {
      finishingList.forEach((finishingObj: CopyItDetailFinishings) => {
        finishings.push({
          copyItFinishingId: finishingObj.copyItFinishingId,
          clientConfigureDefaultId: finishingObj.clientConfigureDefaultId,
          quantity: finishingObj.quantity ? Number(finishingObj.quantity) : 0,
          finishingSubItemId: finishingObj.finishingSubItemId ? Number(finishingObj.finishingSubItemId) : null,
          instruction: finishingObj.instruction
        });
      });
    }
    return finishings;
  }

  /** This method is used to transform T object into request object. */
  public toRequest(item: CopyItInfo): FormData {
    let copyItInfo: CopyItRequest = new CopyItRequest();
    // copyItInfo.copyItNumber = item.copyItNumber;
    copyItInfo.clientId = item.clientId;
    copyItInfo.requestForId = item.requestForId;
    copyItInfo.emailAddress = item.emailAddress;
    copyItInfo.phoneNumber = item.phoneNumber || null;
    copyItInfo.clientAccountId = item.clientAccountId;
    copyItInfo.accountNo = item.accountNo || null;
    copyItInfo.isPrepopulateAccountNumber = item.isPrepopulateAccountNumber;
    copyItInfo.departmentName = item.departmentName;
    copyItInfo.jobname = item.jobname;
    copyItInfo.isPriceQuote = item.isPriceQuote === 1 ? true : false;
    copyItInfo.isProof = item.isProof === 1 ? true : false;
    copyItInfo.rateRequestTypeId = item.rateRequestTypeId;
    copyItInfo.fileOptionId = item.fileOptionId;
    copyItInfo.shareFilePath = item.shareFilePath;

    copyItInfo.dueDate = item.dueDate ? new Date(item.dueDate).toDateString() : null;
    copyItInfo.dueTime = item.dueTime;

    copyItInfo.deliveredTo = item.deliveredTo;
    copyItInfo.shippingServiceId = item.shippingServiceId;
    // copyItInfo.shippingService = item.shippingService;
    copyItInfo.shippingOptionId = item.shippingOptionId;
    copyItInfo.shippingOptionValue = item.shippingOptionValue || null;

    copyItInfo.completedDate = item.completedDate ? new Date(item.completedDate).toDateString() : null;
    copyItInfo.completedTime = item.completedTime;
    copyItInfo.isQualityCheck = item.isQualityCheck ? (item.isQualityCheck === 1 ? true : false) : null;

    copyItInfo.noOfPages = item.noOfPages;
    copyItInfo.noOfCopies = item.noOfCopies;
    copyItInfo.reproductionTypes = item.reproductionTypes;
    copyItInfo.tab = item.tab;

    copyItInfo.finishings = this.getFinishingItem(item.finishings);
    copyItInfo.envelopes = this.setQuantity(item.envelopes || []);
    copyItInfo.oversizedCopies = this.setQuantity(item.overSizedCopies || []);

    copyItInfo.pickAssets = item.pickAssets || [];
    copyItInfo.assets = item.assets || [];


    this.setPaperColorForRequest(item, copyItInfo);
    this.setStockForRequest(item, copyItInfo);
    this.setPaperSizeForRequest(item, copyItInfo);

    // convert data to formData
    const formData: FormData = new FormData();
    formData.append('copyIt', JSON.stringify(copyItInfo));
    item.files && (item.files as File[]).filter((file: File) => (file instanceof File)).forEach((file: File, i: number) => formData.append('files', file, file.name));
    return formData;
  }

  /** Get full path for the client logo file */
  private getFilePath(fileName: string): string {
    return `${environment.base_host_url}CopyIt/${fileName}`;
  }

  /** Set paper color for setting request object */
  private setPaperColorForRequest(item: CopyItInfo, copyItInfo: CopyItRequest): void {
    // set page color
    copyItInfo.paperColors = [];
    const paperColors: CopyItPaperColors[] = [];
    if (item.frontCoverPageColor) { paperColors.push({ ...item.frontCoverPageColor, pageId: CopyItPage.FRONT_PAGE, pageTypeId: item.frontCoverPageType }) };
    if (item.middlePageColor) { paperColors.push({ ...item.middlePageColor, pageId: CopyItPage.MIDDLE_PAGE, pageTypeId: null }) };
    paperColors.forEach((color: CopyItDetailPaperColors) => copyItInfo.paperColors.push({
      copyItColorId: color.copyItColorId,
      clientConfigureDefaultId: color.clientConfigureDefaultId,
      pageId: color.pageId,
      pageTypeId: color.pageTypeId,
      quantity: color.quantity || 0,
      instruction: color.instruction
    }));
  }
  /** Set stock/weight for setting request object */
  private setStockForRequest(item: CopyItInfo, copyItInfo: CopyItRequest): void {
    // set page stock/weight
    copyItInfo.paperStocks = [];
    const paperStock: CopyItDetailPaperStocks[] = [];
    item.frontCoverPageWeight && item.frontCoverPageWeight.forEach((weight: CopyItDetailPaperStocks) => {
      weight.pageId = CopyItPage.FRONT_PAGE; weight.pageTypeId = item.frontCoverPageType;
      paperStock.push(weight);
    });
    item.middlePageWeight && item.middlePageWeight.forEach((weight: CopyItDetailPaperStocks) => {
      weight.pageId = CopyItPage.MIDDLE_PAGE; weight.pageTypeId = null;
      paperStock.push(weight);
    });
    paperStock.forEach((weight: CopyItDetailPaperStocks) => copyItInfo.paperStocks.push({
      copyItPaperStockId: weight.copyItPaperStockId,
      clientConfigureDefaultId: weight.clientConfigureDefaultId,
      quantity: weight.quantity || 0,
      pageId: weight.pageId,
      pageTypeId: weight.pageTypeId,
      instruction: weight.instruction,
    }))
  }
  /** Set papersize for setting request object */
  private setPaperSizeForRequest(item: CopyItInfo, copyItInfo: CopyItRequest): void {
    // set paper sizes
    copyItInfo.paperSizes = [];
    const sizes: CopyItDetailPaperSizes[] = [];
    if (item.frontCoverPageSize) { sizes.push({ ...item.frontCoverPageSize, pageId: CopyItPage.FRONT_PAGE, pageTypeId: item.frontCoverPageType }); }
    if (item.middlePageSize) { sizes.push({ ...item.middlePageSize, pageId: CopyItPage.MIDDLE_PAGE, pageTypeId: null }); }
    sizes.forEach((size: CopyItDetailPaperSizes) => {
      copyItInfo.paperSizes.push({
        copyItPaperSizeId: size.copyItPaperSizeId,
        clientConfigureDefaultId: size.clientConfigureDefaultId,
        pageId: size.pageId,
        pageTypeId: size.pageTypeId,
        instruction: size.instruction,
      })
    });
  }
  /** Set request info details */
  private setRequestInfoForResponse(item: CopyItResponse, copyItInfo: CopyItInfo): void {
    copyItInfo.copyItNumber = item.copyItNumber;
    copyItInfo.clientId = item.clientId;
    copyItInfo.companyName = item.companyName;
    copyItInfo.accountNumber = item.accountNumber;
    copyItInfo.isPrepopulateAccountNumber = item.isPrepopulateAccountNumber;
    copyItInfo.associateId = item.associateId;
    copyItInfo.requestForId = item.requestForId;
    copyItInfo.requestForName = item.requestForName;
    copyItInfo.emailAddress = item.emailAddress;
    copyItInfo.phoneNumber = item.phoneNumber;
    copyItInfo.clientAccountId = item.clientAccountId;
    copyItInfo.accountNo = item.accountNo;
    copyItInfo.departmentName = item.departmentName;
    copyItInfo.jobname = item.jobname;
    copyItInfo.isPriceQuote = isBoolean(item.isPriceQuote) ? (item.isPriceQuote ? 1 : 2) : null;
    copyItInfo.isProof = isBoolean(item.isProof) ? (item.isProof ? 1 : 2) : null;

    copyItInfo.copyItStatusId = item.copyItStatusId;
    copyItInfo.copyItStatus = item.copyItStatus;
    copyItInfo.files = item.files.map((file: FileResponse) => { file.filePath = this.getFilePath(file.fileName); return file; });
    copyItInfo.uploadedFiles = item.files.map((file: FileResponse) => { file.filePath = this.getFilePath(file.fileName); return file; });
    copyItInfo.fileOptionId = item.fileOptionId;
    copyItInfo.shareFilePath = item.shareFilePath;
  }
  /** Set scheduling info detail */
  private setSchedulingInfoForResponse(item: CopyItResponse, copyItInfo: CopyItInfo): void {
    copyItInfo.dueDate = getLocaleDateTime(item.dueDate, item.dueTime);
    copyItInfo.dueTime = getLocaleTime(item.dueTime);
  }
  /** Set shipping info detail */
  private setShippingInfoForResponse(item: CopyItResponse, copyItInfo: CopyItInfo): void {
    copyItInfo.deliveredTo = item.deliveredTo;
    copyItInfo.shippingServiceId = item.shippingServiceId;
    copyItInfo.shippingService = item.shippingService;
    copyItInfo.shippingOptionId = item.shippingOptionId;
    copyItInfo.shippingOptionValue = item.shippingOptionValue;
  }
  /** Set printing info detail */
  private setPrintingInfoForResponse(item: CopyItResponse, copyItInfo: CopyItInfo): void {
    copyItInfo.noOfPages = item.noOfPages;
    copyItInfo.noOfCopies = item.noOfCopies;
    copyItInfo.reproductionTypes = item.reproductionTypes;
    copyItInfo.tab = item.tab;
    copyItInfo.finishings = item.finishings;
    copyItInfo.envelopes = item.envelopes;
    copyItInfo.overSizedCopies = item.oversizedCopies;
    copyItInfo.paperSizes = item.paperSizes;
    copyItInfo.paperColors = item.paperColors;
    copyItInfo.paperStocks = item.paperStocks;
    copyItInfo.rateRequestTypeId = item.rateRequestTypeId;

    copyItInfo.pickAssets = item.pickAssets || [];
    copyItInfo.assets = item.assets || [];

    // filter front and middle page sizes
    copyItInfo.frontCoverPageSize = item.paperSizes
      .find((size: CopyItDetailPaperSizes) => size.pageId === CopyItPage.FRONT_PAGE) || null;
    copyItInfo.middlePageSize = item.paperSizes
      .find((size: CopyItDetailPaperSizes) => size.pageId === CopyItPage.MIDDLE_PAGE) || null;

    // set pageTypeId for front cover and back drop-down
    copyItInfo.frontCoverPageType = copyItInfo.frontCoverPageSize ? copyItInfo.frontCoverPageSize.pageTypeId : null;

    // filter front and middle page colors
    copyItInfo.frontCoverPageColor = item.paperColors && item.paperColors.find((color: CopyItDetailPaperColors) => color.pageId === CopyItPage.FRONT_PAGE) || null;
    copyItInfo.middlePageColor = item.paperColors && item.paperColors.find((color: CopyItDetailPaperColors) => color.pageId === CopyItPage.MIDDLE_PAGE) || null;

    // filter front and middle stock/weight
    copyItInfo.frontCoverPageWeight = item.paperStocks && item.paperStocks.filter((weight: CopyItDetailPaperColors) => weight.pageId === CopyItPage.FRONT_PAGE) || [];
    copyItInfo.middlePageWeight = item.paperStocks && item.paperStocks.filter((weight: CopyItDetailPaperColors) => weight.pageId === CopyItPage.MIDDLE_PAGE) || [];

  }
  /** Set copy center info detail */
  private setCopyCenterInfoForResponse(item: CopyItResponse, copyItInfo: CopyItInfo): void {
    copyItInfo.completedTime = getLocaleTime(item.completedTime);
    copyItInfo.completedDate = getLocaleDateTime(item.completedDate);
    copyItInfo.associateName = item.completedDate ? item.associateName : null;
    copyItInfo.isQualityCheck = isBoolean(item.isQualityCheck) ? (item.isQualityCheck ? 1 : 2) : null;
  }
  /** set default Quantity for Array */
  private setQuantity<T>(items: T[] = []): T[] {
    return items.map(item => { item['quantity'] = item['quantity'] ? item['quantity'] : 0; return item })
  }

}

/** Default copyIt configuration adapter */
@Injectable()
export class DefaultCopyItConfigurationAdapter implements Adapter<DefaultCopyItConfiguration>{
  /** This method is used to transform response object into T object. */
  public toResponse(item: DefaultCopyItConfigurationResponse): DefaultCopyItConfiguration {
    const defaultCopyItConfig: DefaultCopyItConfiguration = new DefaultCopyItConfiguration();
    defaultCopyItConfig.requestForId = item.requestForId;
    defaultCopyItConfig.requestorName = item.requestorName;
    defaultCopyItConfig.emailAddress = item.emailAddress;
    defaultCopyItConfig.phoneNumber = item.phoneNumber;
    defaultCopyItConfig.jobname = item.jobname;
    // defaultCopyItConfig.isPriceQuote = item.isPriceQuote ? 1 : 2;
    // defaultCopyItConfig.isProof = item.isProof ? 1 : 2;
    defaultCopyItConfig.isPriceQuote = isBoolean(item.isPriceQuote) ? (item.isPriceQuote ? 1 : 2) : null;
    defaultCopyItConfig.isProof = isBoolean(item.isProof) ? (item.isProof ? 1 : 2) : null;
    defaultCopyItConfig.noOfPages = item.noOfPages;
    defaultCopyItConfig.noOfCopies = item.noOfCopies;
    defaultCopyItConfig.shippingServiceId = item.shippingServiceId;
    defaultCopyItConfig.shippingService = item.shippingService;
    defaultCopyItConfig.shippingOptionId = item.shippingOptionId;
    defaultCopyItConfig.shippingOptionValue = item.shippingOptionValue;
    defaultCopyItConfig.deliveredTo = item.deliveredTo;
    defaultCopyItConfig.paperSizes = item.paperSizes;
    defaultCopyItConfig.paperColors = item.paperColors;
    defaultCopyItConfig.envelopes = item.envelopes;
    defaultCopyItConfig.paperStocks = item.paperStocks;
    defaultCopyItConfig.finishings = item.finishings;
    defaultCopyItConfig.tab = item.tab;
    defaultCopyItConfig.reproductionTypes = item.reproductionTypes;
    defaultCopyItConfig.overSizedCopies = item.overSizedCopies;
    defaultCopyItConfig.requestorSections = item.requestorSections;
    defaultCopyItConfig.shippingServices = item.shippingServices;

    // filter front and middle page sizes
    defaultCopyItConfig.frontCoverPageSize = item.paperSizes && item.paperSizes.find((size: CopyItDetailPaperSizes) => size.pageId === CopyItPage.FRONT_PAGE) || null;
    defaultCopyItConfig.middlePageSize = item.paperSizes && item.paperSizes.find((size: CopyItDetailPaperSizes) => size.pageId === CopyItPage.MIDDLE_PAGE) || null;

    // set pageTypeId for front cover and back drop-down
    defaultCopyItConfig.frontCoverPageColor = item.paperColors && item.paperColors.find((size: CopyItDetailPaperColors) => size.pageId === CopyItPage.FRONT_PAGE) || null;
    defaultCopyItConfig.middlePageColor = item.paperColors && item.paperColors.find((size: CopyItDetailPaperColors) => size.pageId === CopyItPage.MIDDLE_PAGE) || null;

    // filter front and middle stock/weight
    defaultCopyItConfig.frontCoverPageWeight = item.paperStocks && item.paperStocks.filter((size: CopyItDetailPaperStocks) => size.pageId === CopyItPage.FRONT_PAGE) || [];
    defaultCopyItConfig.middlePageWeight = item.paperStocks && item.paperStocks.filter((size: CopyItDetailPaperStocks) => size.pageId === CopyItPage.MIDDLE_PAGE) || [];

    // set pageTypeId for front cover and back drop-down
    defaultCopyItConfig.frontCoverPageType = defaultCopyItConfig.frontCoverPageSize ? defaultCopyItConfig.frontCoverPageSize.pageTypeId : null;

    return defaultCopyItConfig;
  }
}




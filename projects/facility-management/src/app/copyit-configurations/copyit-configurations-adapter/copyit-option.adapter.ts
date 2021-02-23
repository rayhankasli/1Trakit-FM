/**
 * @author Enter Your Name Here.
 * @description This is adapter service use for transforming data base user requirement.
 */

import { Injectable } from '@angular/core';
// ----------------------------------------------------- //
import { Adapter } from 'common-libs';
// ----------------------------------------------------- //
import { CopyItConfigTabs, Envelope, Finishing, OverSizedCopy, PaperColor, PaperSize, PaperStock, ReproductionType, CopyItConfigRequestorSection, CopyItConfigShippingMethod } from '../../shared/modules/copy-it-print-details/models/copyit-info';
import { CopyitOptions } from '../copyit-configurations.model';

/**  Injectable */
@Injectable()
export class CopyitOptionsAdapter implements Adapter<CopyitOptions> {
    constructor(
        private copyItConfigAdapter: CopyItConfigAdapter
    ) {
    }
    /** This method is used to transform response object into T object. */
    public toResponse(item: CopyitOptions): CopyitOptions {
        const copyitOptions: CopyitOptions = new CopyitOptions(
            item.paperSizes,
            item.envelopes,
            item.paperColors,
            item.paperStocks,
            item.finishings,
            item.tabs,
            item.reproductionTypes,
            item.overSizedCopies,
            item.requestorSections,
            item.shippingServices,
        );
        return copyitOptions;
    }

    /** This method is used to transform T object into request object. */
    public toRequest(item: CopyitOptions): CopyitOptions {
        const overSizedCopies: OverSizedCopy[] = item.overSizedCopies ?
            item.overSizedCopies.map((overSizedCopy: OverSizedCopy) => this.copyItConfigAdapter.overSizedCopy(overSizedCopy)) : [];
        const requestSections: CopyItConfigRequestorSection[] = item.requestorSections ?
            item.requestorSections.map((requestorSections: CopyItConfigRequestorSection) => this.copyItConfigAdapter.requestorSection(requestorSections)) : [];

        const copyitOptions: CopyitOptions = new CopyitOptions(
            item.paperSizes.map((paperSizes: PaperSize) => this.copyItConfigAdapter.paperSize(paperSizes)),
            item.envelopes.map((envelope: Envelope) => this.copyItConfigAdapter.envelop(envelope)),
            item.paperColors.map((paperColor: PaperColor) => this.copyItConfigAdapter.paperColor(paperColor)),
            item.paperStocks.map((paperStock: PaperStock) => this.copyItConfigAdapter.paperStock(paperStock)),
            item.finishings.map((finishing: Finishing) => this.copyItConfigAdapter.finishing(finishing)),
            item.tabs.map((tabs: CopyItConfigTabs) => this.copyItConfigAdapter.tabs(tabs)),
            item.reproductionTypes.map((reproductionType: ReproductionType) => this.copyItConfigAdapter.reproductionType(reproductionType)),
            overSizedCopies,
            requestSections,
            item.shippingServices.map((shippingMethods: CopyItConfigShippingMethod) => this.copyItConfigAdapter.shippingMethod(shippingMethods)),
        );
        return copyitOptions;
    }
}

/**  Injectable */
@Injectable()
export class CopyItConfigAdapter {
    /** This method is used to transform response object into T object. */
    public paperSize(item: PaperSize): PaperSize {
        const clientInfo: PaperSize = new PaperSize();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.paperSizeColorSideId = item.paperSizeColorSideId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        if (!item.clientConfigureDefaultId) {
            clientInfo.isUpdated = true;
        } else {
            clientInfo.isUpdated = item.isUpdated;
        }
        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public paperColor(item: PaperColor): PaperColor {
        const clientInfo: PaperColor = new PaperColor();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.colorId = item.colorId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public envelop(item: Envelope): Envelope {
        const clientInfo: Envelope = new Envelope();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.envelopeId = item.envelopeId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        if (!item.clientConfigureDefaultId) {
            clientInfo.isUpdated = true;
        } else {
            clientInfo.isUpdated = item.isUpdated;
        }
        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public paperStock(item: PaperStock): PaperStock {
        const clientInfo: PaperStock = new PaperStock();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.paperStockId = item.paperStockId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        if (!item.clientConfigureDefaultId) {
            clientInfo.isUpdated = true;
        } else {
            clientInfo.isUpdated = item.isUpdated;
        }
        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public finishing(item: Finishing): Finishing {
        const clientInfo: Finishing = new Finishing();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.finishingId = item.finishingId;
        clientInfo.finishingSubItems = item.finishingSubItems;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        if (!item.clientConfigureDefaultId) {
            clientInfo.isUpdated = true;
        } else {
            clientInfo.isUpdated = item.isUpdated;
        }
        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public tabs(item: CopyItConfigTabs): CopyItConfigTabs {
        const clientInfo: CopyItConfigTabs = new CopyItConfigTabs();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.tabId = item.tabId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        if (!item.clientConfigureDefaultId) {
            clientInfo.isUpdated = true;
        } else {
            clientInfo.isUpdated = item.isUpdated;
        }

        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public reproductionType(item: ReproductionType): ReproductionType {
        const clientInfo: ReproductionType = new ReproductionType();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.reproductionTypeId = item.reproductionTypeId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;

        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public overSizedCopy(item: OverSizedCopy): OverSizedCopy {
        const clientInfo: OverSizedCopy = new OverSizedCopy();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.overSizedCopyId = item.overSizedCopyId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        if (!item.clientConfigureDefaultId) {
            clientInfo.isUpdated = true;
        } else {
            clientInfo.isUpdated = item.isUpdated;
        }

        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public requestorSection(item: CopyItConfigRequestorSection): CopyItConfigRequestorSection {
        const clientInfo: CopyItConfigRequestorSection = new CopyItConfigRequestorSection();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.requestorSectionId = item.requestorSectionId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        return clientInfo;
    }

    /** This method is used to transform response object into T object. */
    public shippingMethod(item: CopyItConfigShippingMethod): CopyItConfigShippingMethod {
        const clientInfo: CopyItConfigShippingMethod = new CopyItConfigShippingMethod();
        clientInfo.clientConfigureDefaultId = item.clientConfigureDefaultId;
        clientInfo.shippingServiceId = item.shippingServiceId;
        clientInfo.defaultClientRate = item.defaultClientRate || 0;
        clientInfo.defaultTenantRate = item.defaultTenantRate || 0;
        clientInfo.isDefault = item.isDefault;
        clientInfo.quantity = item.quantity;
        clientInfo.instruction = item.instruction;
        return clientInfo;
    }
}
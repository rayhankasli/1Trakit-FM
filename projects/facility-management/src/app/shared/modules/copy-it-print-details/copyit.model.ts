/**
 * @author Enter Your Name Here.
 * @description
 */

import { CopyItConfigPaperSizes } from './models/copyit-info/copyItConfigPaperSizes';
import { CopyItConfigPaperColor } from './models/copyit-info/copyitConfigPaperColor';
import { CopyItConfigEnvelop } from './models/copyit-info/copyitConfigEnvelop';
import { CopyItConfigPaperStock } from './models/copyit-info/copyitConfigPaperStocks';
import { CopyItConfigFinishing } from './models/copyit-info/copyitConfigFinishing';
import { CopyItConfigTabs } from './models/copyit-info/copyitConfigTabs';
import { CopyItReproductionTypes } from './models/copyit-info/copyItReproductionTypes';
import { CopyItConfigOverSizedCopy } from './models/copyit-info/copyitConfigOverSizeCopies';
import { CopyItConfigRequestorSection } from './models/copyit-info/copyitConfigRequestorSection';
import { CopyItConfigShippingMethod } from './models/copyit-info/copyitConfigShippingMethod';


/** CoverPage Size Model  */
export interface CoverPageSizeModel {
  readonly clientConfigureDefaultId: number;
  readonly paperSizeColorSideId: number;
  readonly paperSizeId: number;
  readonly paperSize: string;
  readonly priority: number;
  readonly isOther: boolean;
  readonly defaultClientRate: number;
  readonly defaultTenantRate: number;
  readonly isDefault: boolean;
  readonly quantity: number;
  readonly instruction: string;
  readonly subItems: InnerItems
}

/** Inner Items */
export interface InnerItems {
  color: InnerColorItemsObjProp[],
  sides: InnerSizeItemsObjProp[]
}

/** Inner Color Items Obj Prop */
export interface InnerColorItemsObjProp {
  id: number,
  paperColorId: number,
  paperColor: string,
  selected: boolean
}

/** Inner Size Items Obj Prop */
export interface InnerSizeItemsObjProp {
  id: number,
  paperSizeId: number,
  paperSize: string,
  selected: boolean
}


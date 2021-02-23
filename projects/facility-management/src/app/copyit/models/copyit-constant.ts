import { IdLabelPair, LableValuePair } from '../../core/model/common.model';
import { PaperType } from '../../shared/modules/copy-it-print-details/copyits.model';
import { CopyItPageType } from './copy-it.enum';

/** Constant for copyIt Page Types */
export const copyItPageTypes: PaperType[] = [
    {
        paperType: 'Both',
        paperTypeId: CopyItPageType.BOTH
    },
    {
        paperType: 'Cover',
        paperTypeId: CopyItPageType.COVER
    },
    {
        paperType: 'Back',
        paperTypeId: CopyItPageType.BACK
    },
]

/** Constant for COPYIT OPTION LIST */
export const COPYIT_OPTION_LIST: LableValuePair[] = [
    {
        label: 'Yes',
        value: 1
    },
    {
        label: 'No',
        value: 2
    }
]

/** To print Yes/No based on the selected option */
export const YesNo = {
    1: 'Yes', 2: 'No'
}

/** Constant for FILE UPLOAD LIST */
export const FILE_UPLOAD_LIST: IdLabelPair[] = [
    {
        id: 1,
        label: 'Upload File',
    },
    {
        id: 2,
        label: 'Share File Path'
    }
]

/** Constant for RATE REQUEST TYPE */
export const RATE_REQUEST_TYPE: IdLabelPair[] = [
    {
        id: 1,
        label: 'Company Name',
    },
    {
        id: 2,
        label: 'Tenant'
    }
]

/** Table Step Headings */
export enum TabStepsHeading {
    REQUEST_INFORMATION_DETAILS = 'Request Information Details',
    SCHEDULING_DETAILS = 'Scheduling Details',
    PRINT_DETAILS = 'Print Details',
    SHIPPING_DETAILS = 'Shipping Details',
    SUMMARY = 'Summary',
}
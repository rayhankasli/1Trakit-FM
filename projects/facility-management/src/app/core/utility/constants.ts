import { FileOption } from '../model/file-option.model';
import { FileOptions } from './enums';

export enum RoleConstants {
    SUPER_USER = 1,
    MANAGER = 2,
    ASSOCIATE = 3,
    REQUESTOR = 4,
    EMPLOYEE = 5
}

/** phoneNumber mask */
export const PHONE_MASK: Array<string | RegExp> = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

/** URL pattern */
export const URL_PATTERN: RegExp = /^(?:http(s)?:\/\/)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}|)(\/.*)?$/;

/** phoneNumber pattern */
export const PHONE_PATTERN: RegExp = /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/;

/** Email pattern */
export const EMAIL_PATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

export const PASSWORD_PATTERN: RegExp = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

/** Time format used for datePipe in timePicker */
export const TIME_FORMAT: string = 'HH:mm';

/** Date format used for date picker values */
export const DATE_FORMAT: string = 'MM/dd/y';

export const MMMM_YY_DATE_FORMAT: string = 'MMMM-yy';

/** Date format used for datePipe in client list-createdAt  */
export const DATE_TIME_FORMAT: string = 'MM/dd/y hh:mm a';

/** only number pattern */
export const ONLYNUMBER_PATTERN: RegExp = /^[0-9]*$/;

/** used to convert number with fixed 2 digits decimal format */
export const DECIMAL_FORMAT: string = '0.2-2';

/** used to convert number with maximum(2) allowed decimal format */
export const OPTIONAL_DECIMAL_FORMAT: string = '0.0-2';

/** Used for Bulk Upload File Accept */
export const bulkUploadAcceptFiles: string = '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

export const FILE_OPTIONS: FileOption[] = [
    {
        id: FileOptions.UPLOAD_FILE,
        label: 'Upload File',
    },
    {
        id: FileOptions.SHARE_FILE_PATH,
        label: 'Share File Path'
    }
];



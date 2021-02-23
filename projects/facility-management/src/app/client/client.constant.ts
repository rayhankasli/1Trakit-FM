import { ClientListStatus } from './client.model'

export const CLIENT_STATUS_OPTION: ClientListStatus[] = [
    {
        statusKey: 'Active',
        statusValue: true
    },
    {
        statusKey: 'Inactive',
        statusValue: false
    }
]

/** Enum for Client Guard Type */
export enum CLIENT_GUARD_TYPE {
    office = 1,
    mailConfig = 2,
    workflowConfig = 3,
    copyItConfig = 4,
    visitorLog = 5,
}

export const addClientMsg: String = 'Client Added Successfully.';
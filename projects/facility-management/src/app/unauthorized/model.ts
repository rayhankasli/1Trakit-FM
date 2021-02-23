/** Model for page details */
export class NotFoundDetailModel {
    public bg?: string;
    public title?: string;
    public description?: string;
    public showLogoutButton: boolean;
}

export const UnauthorizedDetail: NotFoundDetailModel = {
    bg: '401',
    title: 'Unauthorized',
    description: 'You are not authorized for selected action.',
    showLogoutButton: false,
}
export const NoLicense: NotFoundDetailModel = {
    bg: '401',
    title: 'Unauthorized Access',
    description: 'Please contact to your administrator.',
    showLogoutButton: true,
}
export const InactiveUser: NotFoundDetailModel = {
    bg: 'Inactive',
    title: 'User is Inactive',
    description: 'Please contact to your administrator to activate your account.',
    showLogoutButton: true,
}
export const PageNotFound: NotFoundDetailModel = {
    bg: '404',
    title: 'Page Not Found!',
    description: 'It seems that the page you were trying to reach does not exist anymore, or maybe it has just moved.',
    showLogoutButton: false,
}
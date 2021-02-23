
/** Model class for Inner Items */
export interface InnerItems {
    /** Color */
    color: InnerColorItemsObjProp[],
    /** sides */
    sides: InnerSizeItemsObjProp[]
}

/** Model class for Inner Color Items Obj Prop */
export interface InnerColorItemsObjProp {
    id: number,
    paperColorId: number,
    paperColor: string,
    selected: boolean
}

/** Model class for Inner Size Items Obj Prop */
export interface InnerSizeItemsObjProp {
    id: number,
    paperSizeId: number,
    paperSize: string,
    selected: boolean
}

/** Model class for Colors */
export class Colors {
    /** pageId */
    public pageId: number;
    /** pageTypeId */
    public pageTypeId: number;
    /** clientConfigureDefaultId */
    public clientConfigureDefaultId: number;
    /** instruction */
    public instruction: string;

}
/** Model class for Paper Stocks */
export class PaperStocks {
    /** pageId */
    public pageId: number;
    /** pageTypeId  */
    public pageTypeId: number;
    /** clientConfigureDefaultId */
    public clientConfigureDefaultId: number;
    /** instruction */
    public instruction: string;
}

/** Model class for User */
export class User {
    /** userId */
    public userId: number;
    /** userName */
    public userName: string;
}

/** Model class for Project Code */
export class ProjectCode {
    /** clientAccountId */
    public clientAccountId: number;
    /** accountNo */
    public accountNo: string;
    /** departmentName */
    public departmentName: string;
}

/** Model class for Client */
export class Client {
    /** clientId */
    public clientId: number;
    /** companyName */
    public companyName: string;
    /** accountNumber */
    public accountNumber: boolean;
}

/** Model class for Users */
export class Users {
    /** roleName */
    public roleName: string;
    /** user */
    public user: User[];
}

/** Model class for Paper Type */
export class PaperType {
    /** paperTypeId */
    public paperTypeId: number;
    /** paperType */
    public paperType: string;
}
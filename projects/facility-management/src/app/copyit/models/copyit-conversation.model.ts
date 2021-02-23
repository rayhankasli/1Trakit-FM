/** CopyIt conversation model */
export class CopyItConversation {
    public copyItConversationId: number;
    public copyItId: number;
    public userId: number;
    public actualImageName: string;
    public imageName: string;
    public message: string;
    public createdDate: Date | string;
    public firstName: string;
    public lastName: string;
    public fullName?: string;
    constructor({ copyItConversationId, copyItId, userId, actualImageName, imageName, message, createdDate, firstName, lastName }: CopyItConversation) {
        this.copyItConversationId = copyItConversationId;
        this.copyItId = copyItId;
        this.userId = userId;
        this.actualImageName = actualImageName;
        this.imageName = imageName;
        this.message = message;
        this.createdDate = createdDate ? new Date(createdDate) : createdDate;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = `${firstName} ${lastName}`;
    }
}

/** CopyIt conversation Response */
export class CopyItConversationResponse {
    public isEnabled: boolean;
    public conversations: CopyItConversation[];
}

/** CopyIt conversation Request */
export class CopyItConversationRequest {
    public copyItId: number;
    public userId: number;
    public message: string;
    constructor({ copyItId, userId, message }) {
        this.copyItId = copyItId
        this.userId = userId
        this.message = message
    }
}
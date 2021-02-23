
/** CopyIt conversation Request */
export class BookItConversationRequest {
    public bookItId: number;
    public userId: number;
    public message: string;
    constructor({ bookItId, userId, message }: any) {
        this.bookItId = bookItId
        this.userId = userId
        this.message = message
    }
}

/** CopyIt conversation Response */
export class CopyItConversationResponse {
    public isEnabled: boolean;
    public conversations: BookItConversation[];
}

/** CopyIt conversation model */
export class BookItConversation {
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
    constructor({ copyItConversationId, copyItId, userId, actualImageName, imageName, message, createdDate, firstName, lastName }: BookItConversation) {
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
export class BookItConversationResponse {
    public isEnabled: boolean;
    public chats: BookItConversation[];
}

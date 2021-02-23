/** CopyIt conversation model */
export class Conversation {
  public moduleConversationId: number;
  public moduleId: number;
  public userId: number;
  public actualImageName: string;
  public imageName: string;
  public message: string;
  public createdDate: Date | string;
  public firstName: string;
  public lastName: string;
  public fullName?: string;
  
  constructor(
    { moduleConversationId, moduleId, userId, actualImageName, imageName, message, createdDate, firstName, lastName }: Conversation
  ) {
    this.moduleConversationId = moduleConversationId;
    this.moduleId = moduleId;
    this.userId = userId;
    this.actualImageName = actualImageName;
    this.imageName = imageName;
    this.message = message;
    let utcDate: Date = new Date();
    if (createdDate) {
      const dt: Date = new Date(createdDate);
      utcDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes()));
    }
    this.createdDate = utcDate ? new Date(utcDate) : utcDate;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${firstName} ${lastName}`;
  }
}
/** CopyIt conversation Request */
export class ConversationRequest {
  public moduleId: number;
  public userId: number;
  public message: string;

  constructor(
    { moduleId, userId, message }: any
  ) {
    this.moduleId = moduleId
    this.userId = userId
    this.message = message
  }
}
/** CopyIt conversation Response */
export class ConversationResponse {
  public isEnabled: boolean;
  public conversations: Conversation[];
}
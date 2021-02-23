import { getLocaleDate } from '../core/utility/utility';
import { ComboChartLabel, ComboChartParam } from './dashboard.enum';

/**
 * @author Bikash Das.
 * @description This is data table presentation component.To represent get data from container component and render to dom.
 */

/** This is a model class for CopyItBookItParentResponse parent model class.  */
export class CopyItBookItParentResponse {
  public open: number;
  public inProgress: number;
  public close: number;
  public InOperable: number;
  public Operable: number;
  constructor({ open, inProgress, close, InOperable, Operable }: any) {
    this.open = open || 0;
    this.inProgress = inProgress || 0;
    this.close = close || 0;
    this.InOperable = InOperable || 0;
    this.Operable = Operable || 0;
  }
}


/** This is a model class for CopyItBookItParentResponse */
export class CopyItChartStatusResponse extends CopyItBookItParentResponse {
  constructor({ open, inProgress, close }: any) {
    super({ open, inProgress, close });
  }
}

/** This is a model class for BookItChartStatusResponse */
export class BookItChartStatusResponse extends CopyItBookItParentResponse {
  constructor({ open, inProgress, close }: any) {
    super({ open, inProgress, close });
  }
}
/** This is a model class for FleetChartStatus */
export class FleetChartStatus {
  public Operable: number;
  public InOperable: number;
  constructor(Operable?: number, InOperable?: number) {
    this.Operable = Operable || 0;
    this.InOperable = InOperable || 0;
  }
}

/** This is a model class for ClientStatusChart */
export class ClientStatusChart {
  public companyName: string;
  public new: number;
  public assigned: number;
  public inProgress: number;
  public completed: number;
  public reOpen: number;
  public requestForInformation: number;
  public onhold: number;
  public close: number;
  constructor(
    companyName: string,
    New: number,
    Assigned: number,
    InProgress: number,
    Completed: number,
    ReOpen: number,
    RequestForInformation: number,
    OnHold: number,
    Closed: number
  ) {
    this.companyName = companyName;
    this.new = New;
    this.assigned = Assigned;
    this.inProgress = InProgress;
    this.completed = Completed;
    this.reOpen = ReOpen;
    this.requestForInformation = RequestForInformation;
    this.onhold = OnHold;
    this.close = Closed;
  }
}

/** This is a model class for AssociateStatusChartResponse */
export class AssociateStatusChartResponse {
  public companyName: string;
  public assigned: number;
  public inProgress: number;
  public completed: number;
  public requestForInformation: number;
  public onhold: number;
  public close: number;
  public timeTaken: string;
  public userName: string;

  constructor(
    companyName: string,
    assigned: number,
    inProgress: number,
    completed: number,
    requestForInformation: number,
    onHold: number,
    closed: number,
    timeTaken: string,
    userName: string
  ) {
    this.companyName = companyName;
    this.assigned = assigned;
    this.inProgress = inProgress;
    this.completed = completed;
    this.requestForInformation = requestForInformation;
    this.onhold = onHold;
    this.close = closed;
    this.timeTaken = timeTaken;
    this.userName = userName;
  }
}

/** This is a model class for AssociateStatusChart */
export class AssociateStatusChart {
  public associateGraph: AssociateGraph;
  public timeTaken: TimeTaken;
  public userName: UserName;
}

/** This is a model class for AssociateGraph */
export class AssociateGraph {
  public companyName: string;
  public assigned: number;
  public inProgress: number;
  public completed: number;
  public requestForInformation: number;
  public onhold: number;
  public close: number;
}

/** This is a model class for TimeTaken */
export class TimeTaken {
  public timeTaken: string;
}

/** This is a model class for UserName */
export class UserName {
  public userName: string;
}

/** This is a model class for Period */
export class Period {
  public timePeriod: string;
  public recievedRequest: number;
  public completedrequest: number;

  constructor(timePeriod: string = '', recievedRequest: number = 0, completedrequest: number = 0) {
    this.timePeriod = timePeriod;
    this.recievedRequest = recievedRequest;
    this.completedrequest = completedrequest;
  }
}

/** base annual status */
export class BaseAnnualStatus {
  public period: Period[];
  public totalCompletedRequest: number;
  public totalRecievedRequest: number;
}

/** This is a model class for CopyItRequestStatus */
export class CopyItRequestStatus extends BaseAnnualStatus { }

/** This is a model class for BookItRequestStatus */
export class BookItRequestStatus extends BaseAnnualStatus { }

/** This is a model class for FleetRequestStatus */
export class FleetRequestStatus extends BaseAnnualStatus { }

/** This is a model class for ComboChartResponseStatus */
export class ComboChartResponseStatus extends BaseAnnualStatus {

  constructor(
    period: Period[],
    totalCompletedRequest: number,
    totalRecievedRequest: number
  ) {
    super();
    this.period = period;
    this.totalCompletedRequest = totalCompletedRequest;
    this.totalRecievedRequest = totalRecievedRequest;
  }
}



/** This is a model class  for Notification which contains color properties */
export class Notification {
  public copyItId: number;
  public bookItId: number;
  public assetId: number;
  public notification: string;
  public requestorId: number;
  public assetTicketId: number;
  public dueDate: string | Date;

  constructor(
    copyItId: number,
    bookItId: number,
    assetId: number,
    notification: string,
    requestorId: number,
    assetTicketId: number,
    dueDate: string | Date
  ) {
    this.copyItId = copyItId;
    this.bookItId = bookItId;
    this.assetId = assetId;
    this.notification = notification;
    this.requestorId = requestorId;
    this.assetTicketId = assetTicketId;
    this.dueDate = getLocaleDate(dueDate).toString();
  }
}

/** Combo chart parameter */
export class ComboChartParameter {
  public clientId: number;
  public defaultParam: number;
  constructor(clientId?: number, defaultParam?: number) {
    this.clientId = clientId;
    this.defaultParam = defaultParam || ComboChartParam.Monthly;
  }
}

/** This is a model class   for OpenRequest  */
export class OpenRequest {
  public id: number;
  public ticketId: number;
  public type: number;
  public description: string;
  public dueDate: string | Date;
  public status: string;
  public copies: number;
  public priority: string;
  public categoryId: number;
  public category: string;
  public noOfPeople: number;
  public isDue: boolean;
  public dueText: string;
  public dueClass: string;

  constructor(
    id: number,
    ticketId: number,
    type: number,
    description: string,
    dueDate: string | Date,
    status: string,
    copies: number,
    priority: string,
    categoryId: number,
    category: string,
    noOfPeople: number,
    isDue: boolean,
    dueText: string,
    dueClass: string
  ) {
    this.id = id;
    this.ticketId = ticketId;
    this.type = type;
    this.description = description;
    this.dueDate = getLocaleDate(dueDate);
    this.status = status;
    this.copies = copies;
    this.priority = priority;
    this.categoryId = categoryId;
    this.category = category;
    this.noOfPeople = noOfPeople;
    this.isDue = isDue;
    this.dueText = dueText;
    this.dueClass = dueClass;
  }
}

/** Used to set copyit, bookit, fleet request(Monthly/Quaterly/Annual) report parameter */
export class RequestStatusFilter {
  public clientId?: number | string;
  public isArchive?: number | string;
  public defaultParam?: number | string;

  constructor({ clientId, isArchive, defaultParam }: any) {
    this.clientId = clientId || null;
    this.defaultParam = defaultParam || null;
    this.isArchive = isArchive + '';
  }
}

/** used to manage module licensing */
export class ModuleLicense {
  public copyIt?: boolean = false;
  public bookIt?: boolean = false;
  public copyItSummary?: boolean = false;
  public bookItSummary?: boolean = false;
  public fleetSummary?: boolean = false;
  public statusSummary?: boolean = false;
}

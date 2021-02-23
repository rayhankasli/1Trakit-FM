/**
 * @author Rayhan Kasli | Ronak Patel.
 * @description Service layer class to communicate with the server.
 */
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
// ------------------------------------------------------------- //
import { environment } from '../../environments/environment';
import { Params, TableProperty, HttpService, BaseResponse } from 'common-libs';
import {
  WorkflowAdapter,
  WorkflowFilterAdapter,
  WorkflowTaskAdapter,
  WorkflowTaskFilterAdapter,
  ReasonsAdapter,
  AssignAdapter,
} from './workflow-configurations-adapter/workflow-configurations.adapter';
import {
  Workflow,
  WorkflowFilterRecord,
  WorkflowRequest,
  ToggleStatus,
  WorkflowTaskFilterRecord,
  WorkflowTask,
  Room,
  Floor,
  WorkflowTaskRequest,
  RearrangeTask
} from './workflow-configurations.model';
import { Reasons } from '../shared/components/reasons/reasons.model';
import { AssignedToMaster } from '../core/model/common.model';

@Injectable()
export class WorkflowConfigurationsService {

  /** store base url */
  private baseUrl: string;
  /** API version */
  private readonly API_VERSION: string = environment.api_version;

  constructor(
    private workflowTaskAdapter: WorkflowTaskAdapter,
    private workflowTaskFilterAdapter: WorkflowTaskFilterAdapter,
    private http: HttpService,
    private workflowAdapter: WorkflowAdapter,
    private workflowFilterAdapter: WorkflowFilterAdapter,
    private reasonsAdapter: ReasonsAdapter,
    private assignAdapter: AssignAdapter
  ) {
    this.baseUrl = environment.baseUrl;
  }


  /**
   * Gets assigner list
   * @returns assigner list
   */
  public getAssignerList(clientId: number): Observable<AssignedToMaster[]> {
    const url: string = this.baseUrl + `clients/${clientId}/users`;;
    return this.http.httpGetRequest<AssignedToMaster[]>(
      url).pipe(map((data: BaseResponse<AssignedToMaster[]>) => {
        return data.result ? data.result.map((items: AssignedToMaster) => this.assignAdapter.toResponse(items)) :
          null;
      }));
  }

  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - workflow[]
   */
  public getWorkflows(tableProperty: TableProperty<WorkflowFilterRecord>): Observable<Workflow[]> {
    const url: string = this.baseUrl + 'workflows/search';
    const body: WorkflowFilterRecord = tableProperty.filter ? this.workflowFilterAdapter.toRequest(tableProperty.filter) : null;
    const params: Params<TableProperty> = this.paramProcess(tableProperty);
    return this.http.httpPostRequest<Workflow[]>(
      url, body, { params: { ...params } }).pipe(map((data: BaseResponse<Workflow[]>) => {
        return data.result.map((items: Workflow) => this.workflowAdapter.toResponse(items));
      }));
  }

  /** This will get the record by id from database */
  public getWorkflowById(id: string): Observable<Workflow> {
    const url: string = this.baseUrl + 'workflows/' + id;
    return this.http.httpGetRequest<Workflow>(url, this.API_VERSION).pipe(map((response: BaseResponse<Workflow>) =>
      this.workflowAdapter.toResponse(response.result)));
  }

  /** This will save the record into database */
  public addWorkflow(workflow: Workflow): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'workflows';
    let addWorkflow: WorkflowRequest = this.workflowAdapter.toRequest(workflow);
    return this.http.httpPostRequest<void>(url, addWorkflow);
  }

  /** This will save the record into database */
  public createNewCopy(workflow: Workflow): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + `workflows/${workflow.workflowId}/copy`;
    let copyWorkflow: WorkflowRequest = this.workflowAdapter.toCreateCopyRequest(workflow);
    return this.http.httpPutRequest<void>(url, copyWorkflow);
  }



  /** This will save the record by id into database */
  public updateWorkflow(id: number, workflow: Workflow): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'workflows/' + id;
    let updateWorkflow: WorkflowRequest = this.workflowAdapter.toRequest(workflow);
    return this.http.httpPutRequest<void>(url, updateWorkflow);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteWorkflow(workflow: Workflow): Observable<void> {
    const url: string = this.baseUrl + 'workflows/' + workflow.workflowId;
    return this.http.httpDeleteRequest<void>(url);
  }

  /** This will toggle  the record by id from database */
  public toggleWorkflowStatus(status: ToggleStatus): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'workflows/' + status.id + '/togglestatus';
    return this.http.httpPutRequest<BaseResponse<string>>(url, { isActive: status.isActive });
  }

  /**
   * This method posts the filtered data to the server and returns the particular filtered data.
   * @param tableProperty - the data which needs to be filtered out.
   * @returns - Workflow[]
   */
  public filterWorkflow(tableProperty: TableProperty<WorkflowFilterRecord>): Observable<Workflow[]> {
    const url: string = this.baseUrl + 'Workflow/filter';
    const body: WorkflowFilterRecord = this.workflowFilterAdapter.toRequest(tableProperty.filter);
    const params: Params = this.paramProcess(tableProperty);
    return this.http.httpPostRequest<Workflow[]>(
      url, body, { params: { ...params } }).pipe(map((data: BaseResponse<Workflow[]>) => {
        return data.result.map((items: Workflow) => this.workflowAdapter.toResponse(items));
      }));
  }


  // ******************************************************************* Workflow-Task ********************************************************** //


  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - workflowTask[]
   */
  public getWorkflowTasks(id: string, tableProperty: TableProperty<WorkflowTaskFilterRecord>): Observable<WorkflowTask[]> {
    const url: string = this.baseUrl + 'workflows/' + id + '/tasks/search';
    const params: Params<TableProperty> = this.paramProcess(tableProperty);
    const filter = tableProperty.filter ? tableProperty.filter : {};
    return this.http.httpPostRequest<WorkflowTask[]>(
      url, filter, { params: { ...params } }).pipe(map((data: BaseResponse<WorkflowTask[]>) => {
        return data.result.map((items: WorkflowTask) => this.workflowTaskAdapter.toResponse(items));
      }));
  }


  /** This will save the record into database */
  public addWorkflowTask(workflowTask: WorkflowTaskRequest): Observable<void> {
    const url: string = this.baseUrl + 'taskconfigurations';
    let addNewtask: WorkflowTaskRequest = this.workflowTaskAdapter.toRequest(workflowTask);
    return this.http.httpPostRequest<void>(url, addNewtask);
  }

  /** This will save the record by id into database */
  public updateWorkflowTask(workflowTask: WorkflowTaskRequest): Observable<void> {
    const url: string = this.baseUrl + 'taskconfigurations/' + workflowTask.workflowTaskConfigId;
    let addNewtask: WorkflowTaskRequest = this.workflowTaskAdapter.toRequest(workflowTask);
    return this.http.httpPutRequest<void>(url, addNewtask);
  }

  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteWorkflowTask(workflowTask: WorkflowTask): Observable<void> {
    const url: string = this.baseUrl + 'taskconfigurations/' + workflowTask.workflowTaskConfigId;
    return this.http.httpDeleteRequest<void>(url);
  }

  /**
   * This method posts the filtered data to the server and returns the particular filtered data.
   * @param tableProperty - the data which needs to be filtered out.
   * @returns - WorkflowTask[]
   */
  public filterWorkflowTask(tableProperty: TableProperty<WorkflowTaskFilterRecord>): Observable<WorkflowTask[]> {
    const url: string = this.baseUrl + 'workflowTask/filter';
    const body: WorkflowTaskFilterRecord = this.workflowTaskFilterAdapter.toRequest(tableProperty.filter);
    const params: Params = this.paramProcess(tableProperty);
    return this.http.httpPostRequest<WorkflowTask[]>(
      url, body, { params: { ...params } }).pipe(map((data: BaseResponse<WorkflowTask[]>) => {
        return data.result.map((items: WorkflowTask) => this.workflowTaskAdapter.toResponse(items));
      }));
  }

  /**
   * Get floor list
   * @param id 
   */
  public getFloors(id: string): Observable<Floor[]> {
    const url: string = this.baseUrl + `offices/${id}/floor-list`;
    return this.http.httpGetRequest<Floor[]>(url).pipe(map((response: BaseResponse<Floor[]>) =>
      response.result
    ));
  }

  /** get list of rooms and locations */
  public getRoom(floorId: number): Observable<Room[]> {
    const url: string = this.baseUrl + `floors/${floorId}/locations`;
    return this.http.httpGetRequest<Room[]>(url).pipe(map((response: BaseResponse<Room[]>) =>
      response.result
    ));
  }

  /** rearrange sequence or tasks list */
  public reArrange(workflowTask: RearrangeTask[]): Observable<WorkflowTask[]> {
    const url: string = this.baseUrl + 'taskconfigurations/update-sequence';
    return this.http.httpPutRequest<WorkflowTask>(url, workflowTask);
  }

  // ******************************************* Workflow-Reasons ********************************************************** //


  /**
   * This method invokes the server's get endpoint to fetch the record as per the criteria mentioned in the tabelProperty parameters.
   * It converts the criteria to key and values expected by the API by invoking processParam method. It then invokes the server, on successful
   * response, it fetches the count from the header and invokes the adapter to convert server's response to what is expected by the client.
   * What happens when there is an error from the server ?
   * @param  tableProperty - Store the criteria based on which the records should be fetched from the server.
   * @returns - reasons[]
   */
  public getReasons(tableProperty: TableProperty, clientId: number): Observable<Reasons[]> {
    const url: string = this.baseUrl + 'clients/' + clientId + '/workflows/reasons';
    return this.http.httpGetRequest<Reasons[]>(url).pipe(map((response: BaseResponse<Reasons[]>) =>
      response.result
    ));
  }

  /** This will save the record into database */
  public addReasons(reasons: Reasons): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'workflows/reasons';
    let addReasons: Reasons = this.reasonsAdapter.toRequest(reasons)
    return this.http.httpPostRequest<void>(url, addReasons);
  }
  /** This will update the record by id into database */
  public updateReasons(id: number, reasons: Reasons, clientId: number): Observable<BaseResponse<string>> {
    const url: string = this.baseUrl + 'workflows/reasons/' + id;
    let updatedReasons: Reasons = this.reasonsAdapter.toRequest(reasons)
    return this.http.httpPutRequest<void>(url, updatedReasons);
  }


  /**
   * It invokes the API to delete the record mentioned in the path parameter.
   * @param id The id of the record that needs to be deleted from the server.
   */
  public deleteReasons(reasons: Reasons, clientId: number): Observable<void> {
    const url: string = this.baseUrl + 'workflows/reasons/' + reasons.reasonId;
    return this.http.httpDeleteRequest<void>(url);
  }

  /**
   * This function checks for the presence or criteria and constructs the query params object accordingly.
   * This function should be inside shared/utils
   * @param tableProperty The model which needs to be mapped to the criteria that is accepted by the API.
   */
  private paramProcess(tableProperty: TableProperty): Params {
    const params: Params = new Params();
    if (tableProperty.sort) { params.sort = tableProperty.order + '' + tableProperty.sort };
    if (tableProperty.search) { params.q = tableProperty.search; }
    return params;
  }
}


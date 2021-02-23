import { Component, HostBinding } from '@angular/core';
import { Reasons, ReasonPermissions } from '../../shared/components/reasons/reasons.model';
import { WorkflowConfigurationsService } from '../workflow-configurations.service';
import { ActivatedRoute } from '@angular/router';
import { TableProperty } from 'common-libs';
import { Observable } from 'rxjs/Observable';
import { Permission } from '../../core/enums/role-permissions.enum';

@Component({
  selector: 'app-workflow-reasons-container',
  templateUrl: './workflow-reasons.container.html'
})
export class WorkflowReasonsContainerComponent {

  @HostBinding('class') public class: string;
  /** add new reason button is visible or not */
  public addReasonButton: boolean;
  /** clientId */
  public clientId: number;
  /** list of all the reasons */
  public reasonsList$: Observable<Reasons[]>;
  /**
   * This enum is return offices enum props.
   */
  public get workflowConfigurationEnum(): typeof Permission.WorkFlowConfiguration {
    return Permission.WorkFlowConfiguration;
  }
  /** List of permissions for reasons */
  public reasonPermissions: ReasonPermissions;

  constructor(
    private workflowConfigurationsService: WorkflowConfigurationsService,
    private route: ActivatedRoute,
  ) {
    this.clientId = +this.route.parent.snapshot.paramMap.get('id');
    this.getReasonsList();
    this.addReasonButton = false;
    this.reasonPermissions = this.getReasonsPermissions();
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }
 
  /** add new reason */
  public addNewReason(): void {
    this.addReasonButton = !this.addReasonButton;
  }

  /** close reason form */
  public closeForm(event: boolean): void {
    this.addReasonButton = event;
  }

  /**
   * add new reason in workflow configuration
   * @param reason - Reasons
   */
  public addReason(
    reason: Reasons
  ): void {
    reason.clientId = this.clientId;
    this.workflowConfigurationsService
      .addReasons(reason)
      .subscribe(
        () => {
          this.getReasonsList();
        });
  }

  /**
   * update reason in workflow configuration
   * @param reason - Reasons
   */
  public updateReason(reasons: Reasons): void {
    const id: number = reasons.reasonId;
    reasons.clientId = this.clientId;
    this.workflowConfigurationsService
      .updateReasons(id, reasons, this.clientId)
      .subscribe(
        () => {
          this.getReasonsList();
        });
  }

  /**
   * delete reason in workflow configuration
   * @param reason - Reasons
   */
  public deleteReason(reasons: Reasons): void {
    this.workflowConfigurationsService
      .deleteReasons(reasons, this.clientId)
      .subscribe(() => {
        this.getReasonsList();
      });
  }

  /** Gets assigner list */
  public getReasonsList(): void {
    this.reasonsList$ = this.workflowConfigurationsService.getReasons(new TableProperty(), this.clientId);
  }

  /** Set reasons permissions */
  private getReasonsPermissions(): ReasonPermissions {
    const permission: ReasonPermissions = new ReasonPermissions();
    permission.add = this.workflowConfigurationEnum.addReason;
    permission.delete = this.workflowConfigurationEnum.deleteReason;
    permission.update = this.workflowConfigurationEnum.updateReason;
    permission.view = this.workflowConfigurationEnum.viewReason;
    return permission;
  }
}

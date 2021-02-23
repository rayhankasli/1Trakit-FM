import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
// ---------------------------------- //
import { Permission } from '../../../core/enums/role-permissions.enum';


@Component({
  selector: 'app-workflow-ui',
  templateUrl: './workflow.presentation.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class WorkflowPresentationComponent  {

  @HostBinding('class') public class: string;
  /**
   * This enum is return offices enum props.
   */
  public get workflowConfigurationEnum(): typeof Permission.WorkFlowConfiguration {
    return Permission.WorkFlowConfiguration;
  }
  constructor() {
    this.class = 'd-flex flex-column h-100 overflow-hidden';
  }
}
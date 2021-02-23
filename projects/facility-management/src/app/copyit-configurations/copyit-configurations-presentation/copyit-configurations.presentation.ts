/**
 * @name CopyitConfigurationsPresentationComponent
 * @author Ronak Patel.
 * @description 
 */

import { Component } from '@angular/core';
import { Permission } from '../../core/enums/role-permissions.enum';

/** 
 * CopyitConfigurationsPresentationComponent
 */
@Component({
  selector: 'app-copyit-configurations-ui',
  templateUrl: './copyit-configurations.presentation.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyitConfigurationsPresentationComponent {

  /**
   * This enum is return copyit configuration options enum props.
   */
  public get copyItConfigurationOptionsEnum(): typeof Permission.CopyItConfigurationOptions {
    return Permission.CopyItConfigurationOptions;
  }

  /**
   * This enum is return copyit configuration default values enum props.
   */
  public get copyItDefaultConfigurationEnum(): typeof Permission.CopyItConfigurationDefaultValues {
    return Permission.CopyItConfigurationDefaultValues;
  }

  /**
   * This enum is return copyit configuration manage account enum props.
   */
  public get copyItManageAccount(): typeof Permission.CopyItManageAccount {
    return Permission.CopyItManageAccount;
  }

}

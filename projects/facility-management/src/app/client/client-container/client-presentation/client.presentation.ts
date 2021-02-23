/**
 * @name ClientPresentationComponent
 * @author Mitul Patel.
 * @description Tab presentation to navigate client forms and offices
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Permission } from '../../../core/enums/role-permissions.enum';

/** 
 * ClientPresentationComponent
 */
@Component({
  selector: 'app-client-ui',
  templateUrl: './client.presentation.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClientPresentationComponent implements OnInit {

  /** editMode enabled flag */
  public editMode: boolean;

  /**
   * This enum is return offices enum props.
   */
  public get officeEnum(): typeof Permission.Office {
    return Permission.Office;
  }

  constructor(
    private route: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.editMode = this.route.snapshot.paramMap.has('id');
  }

}

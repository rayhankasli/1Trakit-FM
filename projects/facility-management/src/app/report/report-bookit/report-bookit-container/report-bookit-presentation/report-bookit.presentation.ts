import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
// --------------------------------------------------- //
import { ClientMaster } from '../../../../core/model/common.model';


@Component({
  selector: 'app-report-bookit-ui',
  templateUrl: './report-bookit.presentation.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportBookItPresentationComponent {

  /** list of offices */
  @Input() public set clients(list: ClientMaster[]) {
    if (list) {
      // this._clients = [...[{ client: 'All', clientId: 0 }], ...list];
      this._clients = [...list];
    }
  }

  public get clients(): ClientMaster[] {
    return this._clients;
  }

  /** for group for  */
  public clientFormControl: FormControl = new FormControl();

  /** list of clients */
  private _clients: ClientMaster[];

  constructor() { }
}

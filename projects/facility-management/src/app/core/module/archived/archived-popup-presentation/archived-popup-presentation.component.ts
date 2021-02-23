import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInfo } from '../../../model/core.model';
import { titleCaseConverter } from '../../../utility/utility';

@Component({
  selector: 'app-archived-popup-presentation',
  templateUrl: './archived-popup-presentation.component.html',
})
export class ArchivedPopupPresentationComponent implements OnInit {

  /** This will set the data */
  @Input() public set moduleName(value: string[]) {
    if (value) {
      this.moduleListString = value && titleCaseConverter(value).join(', ').trim();
    }
  }

  /** This will set the data */
  @Input() public set userInfo(value: UserInfo) {
    if (value) {
      this._userInfo = value
      this.clientName = value.clients[0].client;
    }
  }

  public get userInfo(): UserInfo {
    return this._userInfo;
  }

  @Output() public gotItData: EventEmitter<UserInfo>;;

  /** associate client name */
  public clientName: string;
  /** module list conecated with ',' */
  public moduleListString: string;

  private _userInfo: UserInfo

  constructor() {
    this.gotItData = new EventEmitter(true);
  }

  ngOnInit() { }

  /** gotIt  */
  public gotIt(): void {
    this.gotItData.emit(this.userInfo);
  }

}

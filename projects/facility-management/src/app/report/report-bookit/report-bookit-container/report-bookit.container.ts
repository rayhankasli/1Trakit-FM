import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// --------------------------------------------------- //
import { ClientMaster } from '../../../core/model/common.model';
import { CoreDataService } from '../../../core/services/core-data.service';
import { UserInfo } from '../../../core/model/core.model';

@Component({
  selector: 'app-report-bookit-container',
  templateUrl: './report-bookit.container.html'
})
export class ReportBookItContainerComponent implements OnInit {

  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 overflow-hidden';
  
  /** This is a observable which passes the client data to its child component */
  public clients$: Observable<ClientMaster[]>

  constructor(private coreDataService: CoreDataService) { }

  public ngOnInit(): void {
    this.getMasterData();
  }

  private getMasterData(): void {
    this.clients$ = this.coreDataService.userInfo$.pipe(
      map((data: UserInfo) => data.clients)
    );

  }
}

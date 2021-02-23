

/**
 * @name OfficeContainerComponent
 * @author Ronak Patel
 * @description This is a container component for Office. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
//--------------------------------------------------------------------//
import { TableProperty } from 'common-libs';
//--------------------------------------------------------------------//
import { Office, State, City, ToggleStatus, OfficeResult } from '../office.model';
import { OfficeService } from '../office.service';

/**
 * OfficeContainerComponent
 */
@Component({
  selector: 'app-office-container',
  templateUrl: './office.container.html'
})
export class OfficeContainerComponent {
  /** This property is used for add class host element */
  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of office to its child component */
  public offices$: Observable<Office[]>;
  /** This is a observable which passes the last office name to its child component */
  public lastOffice$: Observable<string>;
  /** This is a observable which passes the list of states to its child component */
  public states$: Observable<State[]>;
  /** This is a observable which passes the list of cites to its child component */
  public cites$: Observable<City[]>;

  /** Determines whether  deleted */
  public isDeleted: boolean;
  /** Store Table property */
  public tableProperty: TableProperty;
  /** This property is used for store client id */
  public clientId: string;

  constructor(
    private officeService: OfficeService,
    private route: ActivatedRoute
  ) {
    this.class = 'flex-grow-1 h-100 overflow-hidden';
    this.clientId = this.route.parent.parent.snapshot.paramMap.get('id');
  }


  /** This Method is used to get data from server  */
  public getOffices(tableProperty: TableProperty): void {
    this.tableProperty = tableProperty;
    this.getOffice(tableProperty, this.clientId);
  }

  /** This Method is Used to get data form sever */
  public getStates(): void {
    this.states$ = this.officeService.getStates();
  }

  /** This Method is Used to get data form sever */
  public getCites(state: State): void {
    this.cites$ = this.officeService.getCites(state);
  }

  /** This Method is delete data from server  */
  public deleteOffice(office: Office): void {
    this.officeService.deleteOffice(this.clientId, office).subscribe(() => {
      this.getOffice(this.tableProperty, this.clientId);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public addOffice(office: Office): void {
    this.officeService.addOffice(this.clientId, office).subscribe(() => {
      this.getOffice(this.tableProperty, this.clientId);
    });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateOffice(office: Office): void {
    this.officeService.updateOffice(this.clientId, office).subscribe(() => {
      this.getOffice(this.tableProperty, this.clientId);
    });
  }

  /** onToggleOfficeStatus */
  public onToggleOfficeStatus(status: ToggleStatus): void {
    this.officeService.toggleOfficeStatus(status).subscribe(() => {
      this.getOffice(this.tableProperty, this.clientId);
    });
  }

  /** get office list */
  private getOffice(tableProperty: TableProperty, clientId: string): void {
    this.offices$ = this.officeService.getOffices(tableProperty, clientId).pipe(map((result: OfficeResult) => {
      this.lastOffice$ = of(result.lastOffice);
      return result.offices;
    }));
  }
}

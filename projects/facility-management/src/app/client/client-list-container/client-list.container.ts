/**
 * @name ClientContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for Client. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';
// ------------------------------------------------- //
import { TableProperty } from 'common-libs';
// ------------------------------------------------- //
import { CommonHttpService } from '../../core/services/common-http.service';
import { Client, ClientFilterRequest, ClientListResult } from '../client.model';
import { ClientService } from '../client.service';

/**
 * ClientListContainerComponent
 */
@Component({
  selector: 'app-client-list-container',
  templateUrl: './client-list.container.html'
})
export class ClientListContainerComponent {

  @HostBinding('class') public class: string;
  /** This is a observable which passes the list of client to its child component */
  public clients$: Observable<ClientListResult>;
  /** it will store the table property */
  private tableProperty: TableProperty<ClientFilterRequest>;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private commonHttpService: CommonHttpService,
  ) {
    this.class = 'd-flex flex-column h-100 w-100 overflow-hidden'
  }

  /** This Method is used to get data from server  */
  public getClients(tableProperty: TableProperty<ClientFilterRequest>): void {
    this.tableProperty = tableProperty;
    this.clients$ = this.clientService.getClients(tableProperty);
  }

  /** This Method is delete data from server  */
  public deleteClient(client: Client): void {
    this.clientService.deleteClient(client).subscribe(() => {
      this.commonHttpService.loadLoggedInUserInfo().pipe(take(1)).subscribe();
      this.getClients(this.tableProperty);
    });
  }

  /** This Method is delete data from server  */
  public setClientStatus(client: Client): void {
    this.clientService.setClientStatus(client).subscribe(() => {
      this.commonHttpService.loadLoggedInUserInfo().pipe(take(1)).subscribe();
      this.getClients(this.tableProperty);
    });
  }

  /** Open BookIt configuration */
  public openBookItConfig(client: Client): void {
    // this.router.navigate([client.clientId, 'book-it'], { relativeTo: this.route });
    this.openConfig(client, 'book-it', this.route);
  }
  /** Open CopyIt configuration */
  public openCopyItConfig(client: Client): void {
    // this.router.navigate([client.clientId, 'copyit-configuration'], { relativeTo: this.route });
    this.openConfig(client, 'copyit-configuration', this.route);
  }
  /** Open Mail configuration */
  public openMailConfig(client: Client): void {
    // this.router.navigate([client.clientId, 'mail-configuration'], { relativeTo: this.route });
    this.openConfig(client, 'mail-configuration', this.route);
  }
  /** Open Workflow configuration */
  public openWorkflowConfig(client: Client): void {
    // this.router.navigate([client.clientId, 'workflow-configuration'], { relativeTo: this.route });
    this.openConfig(client, 'workflow-configuration', this.route);
  }

  /** Open BookIt, CopyIt, Mail and Workflow configuration */
  private openConfig(client: Client, configName: string, routeConfig: any): void {
    this.router.navigate([client.clientId, configName], { relativeTo: routeConfig });
  }
}

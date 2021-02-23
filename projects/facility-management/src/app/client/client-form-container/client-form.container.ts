/**
 * @name ClientContainerComponent
 * @author Enter Your Name Here
 * @description This is a container component for ClientDetails. This is responsible for all data retrieving and posting to the server by http calls.
 */
import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';
// ------------------------------------------------------ //
import { ToastrServiceProvider } from 'common-libs';
// ------------------------------------------------------ //
import { CommonHttpService } from '../../core/services/common-http.service';
import { ClientDetails } from '../client.model';
import { ClientService } from '../client.service';
import { addClientMsg } from '../client.constant';



/**
 * ClientContainerComponent
 */
@Component({
  selector: 'app-client-form-container',
  templateUrl: './client-form.container.html',
})
export class ClientFormContainerComponent {
  /** hostBinding */
  @HostBinding('class') public class: string = 'd-flex flex-grow-1 px-3 pb-3 overflow-hidden';
  
  /** This is a observable which passes the ClientDetails object to its child component */
  public client$: Observable<ClientDetails> = this.route.parent.data.pipe(
    map((data: any) => data['client']),
    tap(() => this.addMode = false)
  );

  /**
   * Flag to maintain active mode for form
   */
  private addMode: boolean;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private commonHttpService: CommonHttpService,
    private toast: ToastrServiceProvider
  ) {
    this.addMode = true;
  }
  /** When presentation layer emits the save event, then this will post data on server */
  public addClient(client: ClientDetails): void {
    this.clientService.addClient(client).subscribe(
      () => {
        this.commonHttpService.loadLoggedInUserInfo().pipe(take(1)).subscribe();
        this.toast.success(addClientMsg)
        this.navigateToList();
      },
      // tslint:disable-next-line: no-any
      (err: any) => {
      });
  }

  /** Handle save and continue event for the presentation */
  public saveAndContinue(client: ClientDetails): void {
    this.clientService.addClient(client).subscribe(
      (clientId: number) => {
        this.commonHttpService.loadLoggedInUserInfo().pipe(take(1)).subscribe();
        this.toast.success(addClientMsg);
        this.router.navigate(['../../', clientId, 'offices'], { relativeTo: this.route });
      },
      // tslint:disable-next-line: no-any
      (err: any) => {
      });
  }

  /** When presentation layer emits the save event, then this will post data on server */
  public updateClient(client: ClientDetails): void {
    const id: string = this.route.snapshot.parent.params.id;
    this.clientService.updateClient(id, client).subscribe(
      () => {
        this.commonHttpService.loadLoggedInUserInfo().pipe(take(1)).subscribe();
        this.navigateToList();
      },
      // tslint:disable-next-line: no-any
      (err: any) => {
      });
  }

  /**
   * On cancel changes
   * @param flag boolean 
   */
  public cancelChanges(flag: boolean): void {
    this.navigateToList();
  }

  /**
   * Navigate to list screen
   */
  private navigateToList(): void {
    // let path: string = this.addMode ? '../../' : '../../../';
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}

import { Injectable } from '@angular/core';
import { ClientDetails } from './client.model';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class ClientDetailPreserveService {

  /** Current selected client */
  public clientDetails: ClientDetails;
  private activeClient: BehaviorSubject<ClientDetails>;

  constructor() {
    this.activeClient = new BehaviorSubject(null);
  }

  /** Set client detail */
  public setClientDetail(client: ClientDetails): void {
    this.clientDetails = client;
    this.activeClient.next(client);
  }
  /** Get Client detail */
  public getClientDetail(): Observable<ClientDetails> {
    return this.activeClient.asObservable();
  }

  /** Get Client detail */
  public getClientDetailPromise(): Promise<ClientDetails> {
    return this.activeClient.asObservable().toPromise();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators/map';
import { ClientMaster } from '../model/common.model';
import { UserInfo } from '../model/core.model';
import { getKeyByValue } from '../utility/utility';

const CLIENT_ID: string = 'client-id';

@Injectable({
    providedIn: 'root'
})
export class CoreDataService {

    /** it is a observable which has user info */
    public userInfo$: Observable<UserInfo>;
    /** it is a observable which has client list info */
    public clients$: Observable<ClientMaster[]>;
    /** it is a property which has user info */
    public userInfo: UserInfo;
    /** observable for global client selection */
    public globalClientId$: Observable<number>;
    /** flag to check if any dashboard widgets available */
    public enableDashboard: boolean;
    /** flag to check if visitor-log is licensed */
    public enableVisitorLog: boolean;
    /** client detail */
    private clientD: ClientMaster;
    /** it is a subject which is subscribe by observable */
    private userInfoSubject: BehaviorSubject<UserInfo>;
    /** subject for global client selection */
    private globalClientId: BehaviorSubject<number>;

    constructor() {
        this.userInfoSubject = new BehaviorSubject<UserInfo>(null);
        this.userInfo$ = this.userInfoSubject.asObservable();
        this.clients$ = this.userInfo$.pipe(map((data: UserInfo) => data.clients));

        this.globalClientId = new BehaviorSubject<number>(this.getClientId());
        this.globalClientId$ = this.globalClientId.asObservable();
        this.clientD = new ClientMaster({});
    }

    /** it will set the user info into subject */
    public setUserInfo(userInfo: UserInfo): void {
        this.userInfo = new UserInfo(userInfo.userId, userInfo.userDetail, userInfo.clients);
        this.userInfoSubject.next(this.userInfo);
        if (this.userInfo.clients && this.userInfo.clients.length === 1) {
            this.setClientId(this.userInfo.clients[0].clientId);
        } else {
            this.setClientId(this.getClientId());
        }
    }

    /** it will set the client id into session storage */
    public setClientId(clientId: number): void {
        this.globalClientId.next(clientId);
        sessionStorage.setItem(CLIENT_ID, clientId.toString());
        this.clients$.pipe(map((clients: ClientMaster[]) => clients.find((client: ClientMaster) => client.clientId === clientId)))
            .subscribe((client: ClientMaster) => {
                this.clientD = client ? new ClientMaster(client) : new ClientMaster({});
                this.checkAvailableFeature();
            })
    }

    /** get client detail */
    public clientDetail(): ClientMaster {
        return this.clientD;
    }

    /** get client details Observable for licensing the app */
    public clientDetail$(): Observable<ClientMaster> {
        return this.globalClientId$.pipe(
            switchMap(clientId => clientId && this.clients$.pipe(
                map((clients: ClientMaster[]) => clients.find((client: ClientMaster) => client.clientId === clientId) || new ClientMaster({}))))
        )
    }

    /** it will return the client id from session storage */
    private getClientId(): number {
        const clientId: string = sessionStorage.getItem(CLIENT_ID);
        if (clientId) {
            return Number(clientId);
        }
        return -1;
    }

    /** set flag for enabling dashboard if user has license for copyIt and/or bookIt */
    private checkAvailableFeature(): void {
        const featureList: string[] = [...getKeyByValue(this.clientD.productLicense, true)];
        this.enableDashboard = featureList.includes('copyIt') || featureList.includes('bookIt');
        this.enableVisitorLog = featureList.includes('visitorLog');
    }
}

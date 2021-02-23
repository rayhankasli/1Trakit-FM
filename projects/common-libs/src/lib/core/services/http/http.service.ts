/**
 * @author Ronak Patel 
 * @description This class provides requests function that will be used by the application to perform api calls.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';


/**
 * HttpService
 */
@Injectable()
export class HttpService {
    constructor(
        private http: HttpClient,
    ) { }

    /**
     * generic get request to be used throughout the application.
     * @param url api endpoint
     * @param version optional boolean for interception
     * @param options custom request options
     */
    public httpGetRequest<T>(url: string, options?: any, version: string = '1.0'): Observable<any> {
        const interceptableHeaders: HttpHeaders = this.createHeader(version);
        if (version && options) {
            return this.http.get<T>(url, { headers: interceptableHeaders, ...options });
        } else if (!version && options) {
            return this.http.get<T>(url, { ...options });
        } else if (version && !options) {
            return this.http.get<T>(url, { headers: interceptableHeaders });
        } else {
            return this.http.get<T>(url);
        }
    }

    /**
     * generic delete request to be used throughout the application.
     * @param url api endpoint
     * @param version optional string for interception
     * @param options custom request options
     */
    public httpDeleteRequest<T = any>(url: string, options?: any, version: string = '1.0'): Observable<any> {
        const interceptableHeaders: HttpHeaders = this.createHeader(version);
        if (version && options) {
            return this.http.delete<T>(url, { headers: interceptableHeaders, ...options });
        } else if (!version && options) {
            return this.http.delete<T>(url, { ...options });
        } else if (version && !options) {
            return this.http.delete<T>(url, { headers: interceptableHeaders });
        } else {
            return this.http.delete<T>(url);
        }
    }

    /**
     * generic post request to be used throughout the application.
     * @param url api endpoint
     * @param version optional string for interception
     * @param requestBody data that needs to be sent to along with the request
     * @param options custom request options
     */
    public httpPostRequest<T = any>(url: string, requestBody: any, options?: any, version: string = '1.0'): Observable<any> {
        const interceptableHeaders: HttpHeaders = this.createHeader(version);
        if (version && options) {
            return this.http.post<T>(url, requestBody, { headers: interceptableHeaders, ...options });
        } else if (!version && options) {
            return this.http.post<T>(url, requestBody, { ...options });
        } else if (version && !options) {
            return this.http.post<T>(url, requestBody, { headers: interceptableHeaders });
        } else {
            return this.http.post<T>(url, requestBody);
        }
    }

    /**
     * generic put request to be used throughout the application.
     * @param url api endpoint
     * @param version optional string for interception
     * @param requestBody data that needs to be sent to along with the request
     * @param options custom request options
     */
    public httpPutRequest<T = any>(url: string, requestBody: any, options?: any, version: string = '1.0'): Observable<any> {
        const interceptableHeaders: HttpHeaders = this.createHeader(version);
        if (version && options) {
            return this.http.put<T>(url, requestBody, { headers: interceptableHeaders, ...options });
        } else if (!version && options) {
            return this.http.put<T>(url, requestBody, { ...options });
        } else if (version && !options) {
            return this.http.put<T>(url, requestBody, { headers: interceptableHeaders });
        } else {
            return this.http.put<T>(url, requestBody);
        }
    }

    /**
     * creates the header if there is need of interception
     * @param version string value to be returned true if the url has to be intercepted
     */
    private createHeader(version: string): HttpHeaders {
        const httpHeaders: HttpHeaders = new HttpHeaders({
            'api-version': version,
        });
        return httpHeaders;
    }
}

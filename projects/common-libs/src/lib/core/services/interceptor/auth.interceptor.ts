/**
 * @author Hem Chudgar
 */
import { switchMap, tap, finalize, take, catchError } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpInterceptor, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
  HttpResponse, HttpUserEvent, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from 'oidc-client';
import { throwError } from 'rxjs';
// --------------------------------------------------- //
import { LoaderService } from '../loader/loader.service';
import { AuthService } from '../auth/auth.service';
import { ToastrServiceProvider } from '../toaster/toastr.service';
import { BusyService } from './busy.service';

/**
 * AuthInterceptor
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /** to keep count of current executing requests */
  private totalRequests: number;

  constructor(
    private loaderService: LoaderService,
    private authService: AuthService,
    private _toastr: ToastrServiceProvider,
    private busyService: BusyService,
    @Inject('environment') private environment: any
  ) {
    this.totalRequests = 0;
  }

  /**
   * intercept
   * @param request
   * @param next
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse |
    HttpProgressEvent | HttpResponse<object> | HttpUserEvent<object>> {

    this.totalRequests++;
    this.loaderService.showLoader(true);

    if (request.headers.get('No-auth') === 'true') {
      return this.handleRequest(request, next);
    }
    return this.authService.getUserData().pipe(
      take(1),
      switchMap((user: User) => {
        if (user && user.access_token) {
          const timeZoneOffset: string = request.headers.get('timeZoneOffset') || `${new Date().getTimezoneOffset()}`;
          request = request.clone({
            setHeaders: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache',
              Authorization: `Bearer ${user.access_token}`,
              timeZoneOffset
            }
          });
        }
        return this.handleRequest(request, next);
      })
    );
  }

  /**
   * Handle Http request
   * @param request Http request
   * @param next Http handler
   */
  public handleRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        // set action busy if request sent
        if (event.type === 0) {
          this.busyService.changeBusy(true)
        } else {
          this.busyService.changeBusy(false)
        }
        if (event instanceof HttpResponse && event.status === 200) {
          if (event.body.result && isNaN(event.body.result) && typeof (event.body.result) === 'string') {
            this._toastr.success(event.body.result, null)
          }
        }
      }),
      /** handles the various Error Response. */
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse instanceof HttpErrorResponse) {
          // ERROR HANDLING HEREs
          if (errorResponse.status === 400) {
            const errors = errorResponse.error.hasOwnProperty('errors') ? errorResponse.error['errors'] : errorResponse.error;
            this._toastr.error(errors);
          } else if (errorResponse.status === 401) {
            this._toastr.error('Unauthorized Access');
          } else if (errorResponse.status === 403) {
            this._toastr.error('Access Denied');
          } else if (errorResponse.status === 404) {
            this._toastr.error('End Point Not Found');
          } else if (errorResponse.status === 408) {
            this._toastr.error('Request Timeout');
          } else if (errorResponse.status === 500) {
            this._toastr.error('Internal Server Error');
          }
        }
        return throwError(errorResponse);
      }),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loaderService.showLoader(false);
        }
        this.busyService.changeBusy(false);
      }));
  }
}

/**
 * @author Hem Chudgar 
 */

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/**
 * CacheInterceptor
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    /** intercept */
    public intercept(request: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        if (request.method === 'GET') {
            const customRequest: HttpRequest<any> = request.clone({
                headers: request.headers.set('Cache-Control', 'no-cache')
                    .set('Pragma', 'no-cache')
            });
            return next.handle(customRequest);
        }

        return next.handle(request);
    }
}

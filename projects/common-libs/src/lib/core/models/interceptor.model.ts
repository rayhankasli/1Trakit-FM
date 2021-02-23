/** 
 * @author Ronak Patel 
 */

import { InjectionToken } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthInterceptor } from '../services/interceptor/auth.interceptor';

/**
 * Interceptor model
 */
export class Interceptor {
    /**
     * Provide  of interceptor
     */
    public provide: InjectionToken<HttpInterceptor[]>;
    /**
     * Use class of interceptor
     */
    public useClass: typeof AuthInterceptor;
    /**
     * Multi  of interceptor
     */
    public multi: boolean;
}
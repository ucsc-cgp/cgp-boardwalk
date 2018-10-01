/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Global HTTP error interceptors. Handles 401 and 403 errors.
 */

// Core dependencies
import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import "rxjs/add/operator/catch";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
import { ConfigService } from "../config/config.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    /**
     * @param {ConfigService} configService
     * @param {any} document
     */
    constructor(private configService: ConfigService, @Inject(DOCUMENT) private document: any) {}

    /**
     * Gobal handling of 401 responses; redirect to login page.
     *
     * @param {HttpRequest<any>} request
     * @param {HttpHandler} next
     * @returns {Observable<HttpEvent<any>>}
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .catch((response: any) => {

                const rootUrl = this.configService.getDataURL();

                // Navigate to login on 401
                if ( response instanceof HttpErrorResponse && response.status === 401 ) {
                    this.document.location.replace(`${rootUrl}/auth-wall`);
                }
                // Navigate to register on 403
                else if ( response instanceof HttpErrorResponse && response.status === 403 ) {
                    this.document.location.replace(`${rootUrl}/register`);
                }
                return Observable.throw(response);
            });
    }
}

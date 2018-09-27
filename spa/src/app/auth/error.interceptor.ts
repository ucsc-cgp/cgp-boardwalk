/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Global HTTP error interceptors. Handles 401 and 403 errors.
 */

// Core dependencies
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    /**
     * @param {Router} router
     */
    constructor(private router: Router) {
    }

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

                // Navigate to login on 401
                if ( response instanceof HttpErrorResponse && response.status === 401 ) {
                    this.router.navigateByUrl("/bw-login");
                }
                return Observable.throw(response);
            });
    }
}

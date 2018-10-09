/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Authorization-related guards.
 */

// Core dependencies
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

// App dependencies
import { UserService } from "../data/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    // Locals
    private isUserAuthenticated = false;
    private isUserAuthorized = false;
    private isUserAuthorizationRequired = false;

    /**
     * @param {Router} router
     * @param {UserService} userService
     */
    constructor(private router: Router, private userService: UserService) {
    }

    /**
     * Life cycle hooks
     */

    /**
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<boolean>}
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        // if ( !this.isAuthLoaded ) {
        //
        //     // auth is not loaded so try to sync the user session.
        //     return this.usersService.syncSession().flatMap((user) => {
        //
        //
        //         if ( user.role !== "ANONYMOUS" ) {
        //             return Observable.of(true);
        //         }
        //         else {
        //             this.router.navigate(["/login"]);
        //             return Observable.of(false);
        //         }
        //     }).catch((error) => {
        //         return Observable.of(false);
        //     })
        // }
        //
        // // Auth is loaded so see the  user is authenticated.
        // if ( !this.isUserAuthenticated ) {
        //     this.router.navigate(['/login']);
        //     return Observable.of(false);
        // }
        // else {
        //     return Observable.of(true);
        // }

        return Observable.of(true);
    }
}

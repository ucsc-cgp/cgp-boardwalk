import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { Injectable } from "@angular/core";
import { UserService } from "../data/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    private isUserAuthenticated  = false;
    private isUserAuthorized  = false;
    private isUserAuthorizationRequired = false;

    constructor(private router: Router, private userService: UserService ) {



    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        if (!this.isAuthLoaded) {

            // auth is not loaded so try to sync the user session.
            return this.usersService.syncSession().flatMap((user) => {


                if (user.role !== "ANONYMOUS") {
                    return Observable.of(true);
                }
                else {
                    this.router.navigate(["/login"]);
                    return Observable.of(false);
                }
            }).catch((error) => {
                return Observable.of(false);
            })
        }

        // Auth is loaded so see the  user is authenticated.
        if (!this.isUserAuthenticated) {
            this.router.navigate(['/login']);
            return Observable.of(false);
        }
        else {
            return Observable.of(true);
        }
    }
}
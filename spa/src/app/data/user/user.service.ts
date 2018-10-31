/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Data Access Object for hitting user-related API end points.
 */
// Core dependencies
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
// App dependencies
import { User } from "./user.model";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "../../config/config.service";

@Injectable()
export class UserService {

    /**
     * @param {HttpClient} httpClient
     */
    constructor(private configService: ConfigService, private httpClient: HttpClient) {
    }

    /**
     * Sync Session
     *
     * @returns {Observable<User>}
     */
    public syncSession(): Observable<User> {

        const url = this.buildApiUrl("/me");
        return this.httpClient.get<User>(url);
    }

    private buildApiUrl(url: string) {

        const domain = this.configService.getAPIURL();
        return `${domain}${url}`;
    }

}

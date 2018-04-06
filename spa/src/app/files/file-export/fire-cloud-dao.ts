import { CCBaseDAO } from "../../cc-http/shared";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../config/config.service";

export interface FirecloudNamespace {
    projectName: string;
    role: string;
    creationStatus: string;
}

export interface FirecloudWorkspace {
    accessLevel: "OWNER" | "READER" | "WRITER" | "NO ACCESS";
    workspace: {
        name: string;
        namespace: string;
    };
}

@Injectable()
export class FireCloudDAO extends CCBaseDAO {
    constructor(http: Http, private configService: ConfigService) {
        super(http);
    }

    fetchNamespaces(): Observable<FirecloudNamespace[]> {
        const params = {
            path: "/api/profile/billing"
        };
        return this.get<FirecloudNamespace[]>(this.buildFireCloudProxyUrl(), params, 5);
    }

    fetchWorkspaces(): Observable<FirecloudWorkspace[]> {
        const params = {
            path: "/api/workspaces"
        };
        return this.get<FirecloudWorkspace[]>(this.buildFireCloudProxyUrl(), params, 5);
    }

    /**
     * Privates
     */

    private buildFireCloudProxyUrl() {

        const domain = this.configService.getDataURL();
        return `${domain}/proxy_firecloud`;
    }


}

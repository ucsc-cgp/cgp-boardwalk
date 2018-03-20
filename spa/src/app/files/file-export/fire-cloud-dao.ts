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

@Injectable()
export class FireCloudDAO extends CCBaseDAO {
   constructor(http: Http, private configService: ConfigService) {
       super(http);
   }

    fetchNamespaces(): Observable<FirecloudNamespace[]> {
        const params = {
            path: "/api/profile/billing"
        };
        return this.get<FirecloudNamespace[]>(this.buildDataUrl("/proxy_firecloud"), params);
    }

    /**
     * Privates
     */

    private buildDataUrl(url: string) {

        const domain = this.configService.getDataURL();
        return `${domain}${url}`;
    }


}

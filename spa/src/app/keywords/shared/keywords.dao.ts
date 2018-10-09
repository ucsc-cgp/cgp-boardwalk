/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Data Access Object for hitting keyword-related API end points.
 */

// Core dependencies
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

// App dependencies
import { ConfigService } from "../../config/config.service";
import { KeywordQueryResponse } from "./keyword-query-response.model";

@Injectable()
export class KeywordsDAO  {

    /**
     * @param {ConfigService} configService
     * @param {HttpClient} httpClient
     */
    constructor(private configService: ConfigService, private httpClient: HttpClient) {}

    /**
     * Search Keywords
     *
     * @param {Object} query
     * @returns {Observable<KeywordQueryResponse>}
     */
    public searchKeywords(query: Object): Observable<KeywordQueryResponse> {

        // Build API URL
        const url = this.buildApiUrl("/keywords");

        // Build up query params
        const params = new HttpParams()
            .set("q", query["q"])
            .set("from", query["from"])
            .set("size", query["size"])
            .set("type", query["type"]);
        return this.httpClient.get<KeywordQueryResponse>(url, {params});
    }

    /**
     * Build full API Url
     *
     * @param url
     * @returns {string}
     */
    private buildApiUrl(url: string) {
        const domain = this.configService.getAPIURL();
        return `${domain}${url}`;
    }
}

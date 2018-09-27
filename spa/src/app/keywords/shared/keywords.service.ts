/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Data Access Object for hitting keyword-related API end points.
 */

// Core dependencies
import { Injectable } from "@angular/core";
import { KeywordsDAO } from "./keywords.dao";
import { Observable } from "rxjs/Observable";

// App dependencies
import { KeywordQueryResponse } from "./keyword-query-response.model";

@Injectable()
export class KeywordsService {

    constructor(private keywordsDAO: KeywordsDAO) {}

    /**
     * Search keywords
     *
     * @param {string} searchTerm
     * @param {string} keywordType
     * @returns {Observable<KeywordQueryResponse>}
     */
    searchKeywords(searchTerm: string, keywordType: string): Observable<KeywordQueryResponse> {

        const query = {
            q: searchTerm,
            from: 1,
            size: 5,
            type: keywordType
        };
        return this.keywordsDAO.searchKeywords(query);
    }
}

/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Data access object, connecting to file-related end points.
 */

// Core dependencies
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/delay";

// App dependencies
import { ConfigService } from "../../config/config.service";
import { FacetTermsResponse } from "./facet-terms-response.model";
import { FileSummary } from "../file-summary/file-summary";
import { FileManifestSummary } from "../file-manifest-summary/file-manifest-summary";
import { FilesAPIResponse } from "./files-api-response.model";
import { Dictionary } from "../../shared/dictionary";
import { ICGCQuery } from "./icgc-query";
import { Term } from "./term.model";
import { FileFacet } from "./file-facet.model";
import { TableModel } from "../table/table.model";
import { TableParamsModel } from "../table/table-params.model";

enum ExportFormat {
    TSV = "tsv",
    BDBAG = "bdbag"
}

@Injectable()
export class FilesDAO {

    /**
     * @param {ConfigService} configService
     * @param {HttpClient} httpClient
     */
    constructor(private configService: ConfigService, private httpClient: HttpClient) {
    }

    /**
     * Fetch FileFacets
     *
     * http://docs.icgc.org/portal/api-endpoints/#!/repository/findAll
     *
     * @param {Map<string, FileFacet>} selectedFacetsByName
     * @param ordering
     * @returns {Observable<FileFacet[]>}
     */
    public fetchFileFacets(selectedFacetsByName: Map<string, FileFacet>, ordering): Observable<FileFacet[]> {

        // Build the API URL
        const url = this.buildApiUrl(`/repository/files`);

        // Build up the query params
        const selectedFacets = Array.from(selectedFacetsByName.values());
        const filters = this.facetsToQueryString(selectedFacets);
        const params = new HttpParams()
            .set("from", "1")
            .set("size", "1")
            .set("filters", filters);

        return this.httpClient
            .get<FilesAPIResponse>(url, {params})
            .map((repositoryFiles: FilesAPIResponse) => {
                    return this.createFileFacets(selectedFacetsByName, repositoryFiles, ordering);
                }
            );
    }

    /**
     * Fetch file summary.
     *
     * http://docs.icgc.org/portal/api-endpoints/#!/repository/getSummary
     *
     * @param {FileFacet[]} selectedFacets
     * @returns {Observable<FileSummary>}
     */
    public fetchFileSummary(selectedFacets?: FileFacet[]): Observable<FileSummary> {

        // Build up API URL
        const url = this.buildApiUrl(`/repository/files/summary`);

        // Build up the query params
        const filters = this.facetsToQueryString(selectedFacets);
        const params = new HttpParams()
            .set("filters", filters);

        return this.httpClient.get<FileSummary>(url, {params});
    }

    /**
     * Fetch facet ordering.
     *
     * @returns {Observable<Ordering>}
     */
    public fetchFacetOrdering(): Observable<Ordering> {

        const url = this.buildApiUrl(`/repository/files/order`);
        return this.httpClient.get<Ordering>(url);
    }

    /**
     * Fetch file table data.
     *
     * @param {Map<string, FileFacet>} selectedFacetsByName
     * @param {TableParamsModel} tableParams
     * @returns {Observable<TableModel>}
     */
    public fetchFileTableData(selectedFacetsByName: Map<string, FileFacet>, tableParams: TableParamsModel): Observable<TableModel> {

        // Build API URL
        const url = this.buildApiUrl(`/repository/files/`);

        // Build query params
        const selectedFacets = Array.from(selectedFacetsByName.values());
        const filters = this.facetsToQueryString(selectedFacets);

        const params = new HttpParams()
            .set("filters", filters)
            .set("from", tableParams.from.toString(10))
            .set("size", tableParams.size.toString(10));

        if ( tableParams.sort && tableParams.order ) {
            params
                .set("sort", tableParams.sort)
                .set("order", tableParams.order);
        }

        return this.httpClient.get<FilesAPIResponse>(url, {params})
            .map((repositoryFiles: FilesAPIResponse) => {
                    // keep our size as this is being lost on API return at the moment when the result set is less than
                    // the page size.
                    let pagination = Object.assign(repositoryFiles.pagination, {size: tableParams.size});
                    return new TableModel(repositoryFiles.hits, repositoryFiles.pagination);
                }
            );
    }

    /**
     * Fetch manifest summary.
     *
     * @param selectedFacets
     * @returns {Observable<FileManifestSummary>}
     */
    fetchFileManifestSummary(selectedFacets: FileFacet[]): Observable<Dictionary<FileManifestSummary>> {

        const query = new ICGCQuery(this.facetsToQueryString(selectedFacets));

        const filters = JSON.parse(query.filters);
        let repoNames = []; // TODO empty array default throws an error. There needs to be something in the repoNames

        if ( filters.file && filters.file.repoName ) {
            repoNames = filters.file.repoName.is;
        }

        // convert query from string back to object for post
        const form = Object.assign({}, {
            query: {
                filters: JSON.parse(query.filters)
            },
            repoNames: repoNames
        });

        const url = this.buildApiUrl("/repository/files/summary/manifest");

        return this.httpClient.post<Dictionary<FileManifestSummary>>(url, form);
    }

    /**
     * Fetch ordered file facets.
     *
     * @param {Map<string, FileFacet>} selectedFacetsByName
     * @returns {Observable<FileFacet[]>}
     */
    public fetchOrderedFileFacets(selectedFacetsByName: Map<string, FileFacet>): Observable<FileFacet[]> {

        return this.fetchFacetOrdering()
            .switchMap((ordering: Ordering) => {
                return this.fetchFileFacets(selectedFacetsByName, ordering);
            });
    }

    /**
     * Download manifest.
     *
     * @param selectedFacets
     * @returns {any}
     */
    public downloadFileManifest(selectedFacets: FileFacet[]): Observable<any> {

        const query = new ICGCQuery(this.facetsToQueryString(selectedFacets), "tarball");

        let params = new URLSearchParams();
        Object.keys(query).forEach((paramName) => {
            params.append(paramName, query[paramName]);
        });

        window.location.href = this.buildApiUrl(`/repository/files/export?${params.toString()}`);
        return Observable.of(true); // TODO error handling? I'm not sure setting the href causes any errors
    }

    /**
     * Export to FireCloud.
     *
     * @param {FileFacet[]} selectedFacets
     * @returns {Observable<boolean>}
     */
    exportToFireCloud(selectedFacets: FileFacet[]): Observable<boolean> {

        // Need to open window here, as browser will not let you open it in a callback.
        const newWindow = window.open("", "_blank");

        // Build up export URL
        const url = this.buildExportUrl(selectedFacets);

        // Build query params
        const filters = this.facetsToQueryString(selectedFacets);
        const params = new HttpParams()
            .set("filters", filters)
            .set("format", "bdbag");

        return this.httpClient.get<any>(url, {params})
            .map((resp: any) => {
                const bdbagUrl = encodeURIComponent(resp.url);
                const url = `https://bvdp-saturn-prod.appspot.com/#import-data?url=${bdbagUrl}`; // TODO revisit - overrides export URL above
                newWindow.location.href = url;
                return true;
            });
    }

    /**
     * Privates
     */

    /**
     * Build full API URL
     *
     * @param url
     * @returns {string}
     */
    private buildApiUrl(url: string) {

        const domain = this.configService.getAPIURL();
        return `${domain}${url}`;
    }

    /**
     * Build data URL.
     *
     * @param {string} url
     * @returns {string}
     */
    private buildDataUrl(url: string) {

        const domain = this.configService.getDataURL();
        return `${domain}${url}`;
    }

    /**
     * Build export URL.
     * @param {FileFacet[]} selectedFacets
     * @returns {string}
     */
    private buildExportUrl(selectedFacets: FileFacet[]) {

        return this.buildApiUrl(`/repository/files/export`);
    }

    /**
     * Map files API response into FileFacet objects.
     *
     * @param {Map<string, FileFacet>} selectedFacetsByName
     * @param {FilesAPIResponse} filesAPIResponse
     * @param {Ordering} ordering
     * @returns {FileFacet[]}
     */
    private createFileFacets(selectedFacetsByName: Map<string, FileFacet>, filesAPIResponse: FilesAPIResponse, ordering: Ordering): FileFacet[] {

        // Determine the set of facets that are to be displayed
        const visibleFacets = _.pick(filesAPIResponse.termFacets, ordering.order) as Dictionary<FacetTermsResponse>;

        // Calculate the number of terms to display on each facet card
        const shortListLength = this.calculateShortListLength(visibleFacets);

        const facetNames = Object.keys(visibleFacets);
        const newFileFacets = facetNames.map((facetName) => {

            const responseFileFacet = visibleFacets[facetName];
            const oldFacet: FileFacet = selectedFacetsByName.get(facetName);

            let responseTerms: Term[] = [];

            // the response from ICGC is missing the terms field instead of being an empty array
            // we need to check it's existence before iterating over it.
            if ( responseFileFacet.terms ) {

                // Create term from response, maintaining the currently selected term.
                responseTerms = responseFileFacet.terms.map((responseTerm) => {

                    let oldTerm: Term;
                    if ( oldFacet ) {
                        oldTerm = oldFacet.termsByName.get(responseTerm.term);
                    }

                    let selected = false;
                    if ( oldTerm ) {
                        selected = oldTerm.selected;
                    }

                    return new Term(responseTerm.term, responseTerm.count, selected, "000000");
                });
            }

            if ( !responseFileFacet.total ) {
                responseFileFacet.total = 0; // their default is undefined instead of zero
            }

            // Create file facet from newly built terms and newly calculated total
            return new FileFacet(facetName, responseFileFacet.total, responseTerms, shortListLength);
        });

        let fileIdTerms = [];
        if ( selectedFacetsByName.get("fileId") ) {
            fileIdTerms = selectedFacetsByName.get("fileId").terms;
        }

        let donorIdTerms = [];
        if ( selectedFacetsByName.get("donorId") ) {
            donorIdTerms = selectedFacetsByName.get("donorId").terms;
        }

        // Add donor ID search facet
        let donorIdFileFacet = new FileFacet("donorId", 9999999, donorIdTerms, shortListLength, "SEARCH");
        newFileFacets.unshift(donorIdFileFacet);

        // Add file ID search facet
        let fileIdFileFacet = new FileFacet("fileId", 88888888, fileIdTerms, shortListLength, "SEARCH");
        newFileFacets.unshift(fileIdFileFacet);

        // Check if we have a sort order and if so, order facets accordingly
        if ( ordering.order.length ) {

            const facetMap = newFileFacets.reduce((acc: Map<string, FileFacet>, facet: FileFacet) => {
                return acc.set(facet.name, facet);
            }, new Map<string, FileFacet>());

            return ordering.order.map((name: string) => {
                return facetMap.get(name);
            });
        }

        return newFileFacets;
    }

    /**
     * Calculate the maximum number of terms to display inside a facet card. Determine term count mode across all
     * facets. If mode + 1 is less than 5, maximum number of terms if 5. Is mode + 1 is more than 10, maximum number of
     * terms is 10. Otherwise, use the mode + 1 as the maximum number of terms.
     *
     * @param facetTermsResponse {Dictionary<FacetTermsResponse>}
     * @returns {number}
     */
    private calculateShortListLength(facetTermsResponse: Dictionary<FacetTermsResponse>): number {

        let fileFacetCountByTermCount = _.chain(facetTermsResponse)
            .groupBy((termFacet) => {
                return termFacet.terms.length;
            })
            .mapValues((terms: FacetTermsResponse[]) => {
                return terms.length;
            })
            .value();

        // Find the length of the largest array of file facets - we'll use this to determine which term count is
        // most common
        let largestFileFacetCount = _.chain(fileFacetCountByTermCount)
            .sortBy()
            .reverse()
            .value()[0];

        // Find the term count(s) with the largest number of file facets, then take the smallest term count if there
        // is more than one term count with the largest number of file facets
        let termCount = _.chain(fileFacetCountByTermCount)
            .pickBy((count: number) => {
                return count === largestFileFacetCount;
            })
            .keys()
            .sortBy()
            .value()[0];

        // Generalize term count for display
        let maxTermCount = parseInt(termCount, 10);
        if ( maxTermCount <= 3 ) {
            maxTermCount = 3;
        }
        else if ( maxTermCount > 10 ) {
            maxTermCount = 10;
        }

        return maxTermCount;
    }

    /**
     * Filter To Querystring
     *
     * return JSON string of: { file: { primarySite: { is: ["Brain"] } } }
     * if there aren't any file filters, it's just { }, not { file: { } }
     *
     * TODO is this the ICGC workaround?
     *
     * @param {FileFacet[]} selectedFacets
     * @returns {string}
     */
    private facetsToQueryString(selectedFacets: FileFacet[]): string {


        let filters = selectedFacets.reduce((facetAcc, facet) => {

            // paranoid check for no facets.
            if ( !facet.terms || !facet.terms.length ) {
                return facetAcc;
            }

            // get an array of term names if any
            const termNames = facet.selectedTerms.map((term) => {
                return term.name;
            });

            if ( termNames.length ) {
                // only add the facet if there is a selected term.
                facetAcc[facet.name] = {is: termNames};
            }

            return facetAcc;
        }, {});

        // empty object if it doesn't have any filters;
        const result = Object.keys(filters).length ? {file: filters} : {};
        return JSON.stringify(result);
    }
}

/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Core files component, displays results summary, facets and †he current set of facet filters.
 */

// Core dependencies
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/skip";

// App dependencies
import { AppState } from "../_ngrx/app.state";
import { FileExportManifestRequestAction } from "./_ngrx/file-export/file-export.actions";
import { FetchFileFacetsRequestAction } from "./_ngrx/file-facet-list/file-facet-list.actions";
import {
    selectFileFacetsFileFacets,
    selectFileSummary,
    selectSelectedFileFacets,
    selectSelectedViewState
} from "./_ngrx/file.selectors";
import {
    DownloadFileManifestAction,
    FetchFileManifestSummaryRequestAction
} from "./_ngrx/file-manifest-summary/file-manifest-summary.actions";
import { FilesComponentState } from "./files.component-state";

@Component({
    selector: "bw-files",
    templateUrl: "files.component.html",
    styleUrls: ["files.component.scss"]
})
export class FilesComponent implements OnInit {

    // Public/template variables
    public state$: Observable<FilesComponentState>;

    /**
     * @param route {ActivatedRoute}
     * @param store {Store<AppState>}
     * @param {MatDialog} dialog
     * @param {MatIconRegistry} iconRegistry
     * @param {DomSanitizer} sanitizer
     */
    constructor(private route: ActivatedRoute,
                private store: Store<AppState>,
                private location: Location,
                private dialog: MatDialog,
                private iconRegistry: MatIconRegistry,
                private sanitizer: DomSanitizer) {

        iconRegistry.addSvgIcon("firecloud",
            sanitizer.bypassSecurityTrustResourceUrl("/assets/images/thirdparty/FireCloud-white-icon.svg"));
    }

    /**
     * Public API
     */

    /**
     * Dispatch action to request updated manifest summary (ie summary counts, file sizes etc)
     */
    public requestManifestSummary() {

        this.store.dispatch(new FetchFileManifestSummaryRequestAction());
    }


    /**
     * Dispatch action to download manifest summary.
     */
    public onDownloadManifest() {

        this.store.dispatch(new DownloadFileManifestAction());
    }

    /**
     * Dispatch action to export manifest to FireCloud.
     */
    public onExportToFireCloud() {

        this.store.dispatch(new FileExportManifestRequestAction());
    }

    /**
     * PRIVATES
     */

    /**
     * Parse queryParams into file filters
     */
    private initQueryParams() {

        this.route.queryParams
            .map((params) => {

                if ( params && params["filters"] && params["filters"].length ) {
                    return {
                        filters: JSON.parse(decodeURIComponent(params["filters"]))
                    };
                }
                else {
                    return {};
                }
            })
            .subscribe((query) => {
                // this currently kicks off the browser data load
                this.store.dispatch(new FetchFileFacetsRequestAction());
            });
    }

    /**
     * Life cycle hooks
     */

    /**
     * Set up selectors and request initial data set.
     */
    public ngOnInit() {

        // Grab the files summary - skip the default value to help prevent visual flash of facet components before
        // auth has resolved.
        const selectFileSummary$ = this.store.select(selectFileSummary).skip(1);

        // Grab all file facets - skip the default value to help prevent visual flash of facet components before
        // auth has resolved.
        const fileFacets$ = this.store.select(selectFileFacetsFileFacets).skip(1);

        // Grab the selected file facets - we'll display these in the filter bar above the facets - skip the default
        // value to help prevent visual flash of facet components before auth has resolved.
        const selectedFileFacets$ = this.store.select(selectSelectedFileFacets).skip(1);

        // Roll the files summary, file facets and selected file facets into a single state observable - we can use
        // this observable to prevent a visual flash of facet components before auth etc has been resolved.
        this.state$ = fileFacets$.combineLatest(selectFileSummary$, selectedFileFacets$, (fileFacets, selectFileSummary, selectedFileFacets) => {

            return {
                fileFacets,
                selectFileSummary,
                selectedFileFacets
            };
        });

        // Initialize the filter state from the params in the route.
        this.initQueryParams();

        // Set up the URL state management - write the browser address bar when the selected facets change.
        this.store.select(selectSelectedViewState)
            .distinctUntilChanged((previous, current) => {
                return _.isEqual(previous, current);
            })
            .subscribe((viewState) => {

                // Convert facets to query string state
                const queryStringFacets = viewState.selectSelectedFileFacets.reduce((accum, selectedFacet) => {
                    accum.add({
                        facetName: selectedFacet.name,
                        terms: selectedFacet.selectedTerms.map(term => term.name)
                    });
                    return accum;
                }, new Set<any>());

                const path = /*viewState.selectSelectedEntity.key*/"boardwalk";
                const params = new URLSearchParams();
                if ( queryStringFacets.size > 0 ) {
                    params.set("filter", JSON.stringify(Array.from(queryStringFacets)));
                }

                this.location.replaceState(path, params.toString());
            });
    }
}

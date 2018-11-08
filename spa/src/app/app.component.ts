/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Top-level application component.
 */

// Core dependencies
import { Location } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs/Subscription";

// App dependencies
import { SyncSessionRequestAction } from "./auth/_ngrx/auth.actions";
import { SetViewStateAction } from "./files/_ngrx/file-facet-list/file-facet-list.actions";
import { QueryStringFacet } from "./files/shared/query-string-facet.model";
import { AppState } from "./_ngrx/app.state";

@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {

    // Locals
    private actionsSubscription: Subscription;

    /**
     * @param {Store<AppState>} store
     */
    constructor(private activatedRoute: ActivatedRoute, private location: Location, private store: Store<AppState>) {
    }


    /**
     * Privates
     */

    /**
     * Returns true if a filter state is encoded in the query params.
     *
     * @param {ParamMap} paramMap
     * @returns {boolean}
     */
    private isFilterParamSpecified(paramMap: ParamMap): boolean {

        return paramMap.keys.some((key: string) => {
            return key === "filter";
        });
    }

    /**
     * Parse the "filter" query string param, if specified.
     *
     * @param {ParamMap} paramMap
     * @returns {QueryStringFacet[]}
     */
    private parseQueryStringFacets(paramMap: ParamMap): QueryStringFacet[] {

        if ( this.isFilterParamSpecified(paramMap) ) {

            // We have a filter, let's extract it.
            let filter;
            const filterParam = paramMap.get("filter");
            try {
                filter = JSON.parse(filterParam);
            }
            catch (error) {
                console.log(error);
            }

            let queryStringFacets = [];
            if ( filter && filter.length && filter[0].facetName ) {
                queryStringFacets = filter.map((selectedFacet) => {
                    return new QueryStringFacet(selectedFacet["facetName"], selectedFacet["terms"]);
                });
            }

            return queryStringFacets;
        }

        return [];
    }

    /**
     * Determine the current selected tab.
     *
     * @returns {string}
     */
    private parseTab(): string {

        const path = this.location.path().split("?")[0];
        if ( path === "/files" ) {
            return "files";
        }

        if ( path === "/specimens" ) {
            return "specimens";
        }

        return "projects";
    }

    /**
     * Set up app state from query string parameters, if any.
     */
    private setAppStateFromURL() {

        this.actionsSubscription =
            this.activatedRoute.queryParamMap
                .map((paramMap: ParamMap): QueryStringFacet[] => {

                    return this.parseQueryStringFacets(paramMap);
                })
                .subscribe((filter: QueryStringFacet[]) => {

                    const tab = this.parseTab();
                    this.store.dispatch(new SetViewStateAction(tab, filter));
                });
    }

    /**
     * Lifecycle hooks
     */

    /**
     * Component initialization - check authentication status of current user and set up app state from URL, if 
     * specified.
     */
    ngOnInit() {

        // Check authentication status of current user
        this.store.dispatch(new SyncSessionRequestAction());

        // Set up initial app state
        this.setAppStateFromURL();
    }

    /**
     * Kill subscriptions on destroy of component.
     */
    public ngOnDestroy() {

        if ( !!this.actionsSubscription ) {
            this.actionsSubscription.unsubscribe();
        }
    }
}

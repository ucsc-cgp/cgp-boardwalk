// Core dependencies
import { Component, Input, OnInit } from "@angular/core";
import { FileFacet } from "../shared/file-facet.model";
import { AppState } from "../../_ngrx/app.state";
import { Store } from "@ngrx/store";
import { FileFacetSelectedEvent } from "../file-facets/file-facet.events";
import { SelectFileFacetAction } from "../_ngrx/file-facet-list/file-facet-list.actions";

// App dependencies

/**
 * Component displaying filtered results.
 */
@Component({
    selector: "bw-file-filter-results",
    templateUrl: "./file-filter-results.component.html",
    styleUrls: ["./file-filter-results.component.scss"],
})

export class FileFilterResultsComponent implements OnInit {

    // Inputs
    @Input() selectedFacets: FileFacet[];

    // locals
    store: Store<AppState>;
    removable = true;

    constructor(store: Store<AppState>) {
        this.store = store;
    }

    removeFacet(facetName: string, termName: string) {
        this.store.dispatch(new SelectFileFacetAction(new FileFacetSelectedEvent(facetName, termName, false)));
    }

    ngOnInit() {
    }
}

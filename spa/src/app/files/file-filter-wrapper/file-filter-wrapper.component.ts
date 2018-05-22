// Core dependencies
import { Component, Input } from "@angular/core";
import { FileFacet } from "../shared/file-facet.model";

/**
 * Component wrapper for filtering of term name.
 */
@Component({
    selector: "bw-file-filter-wrapper",
    templateUrl: "./file-filter-wrapper.component.html",
    styleUrls: ["./file-filter-wrapper.component.scss"],
})

export class FileFilterWrapperComponent {

    // Inputs
    @Input() fileFacets: FileFacet[];
    @Input() selectedFacets: FileFacet[];
}

/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * State backing core files component.
 */

// App dependencies
import { FileSummary } from "./file-summary/file-summary";
import { FileFacet } from "./shared/file-facet.model";

export interface FilesComponentState {
    fileFacets: FileFacet[];
    selectedFileFacets: FileFacet[];
    selectFileSummary: FileSummary;
}

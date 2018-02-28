/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 * 
 * Model of counts, file sizes and other summary values of the current selection of facets.
 */

export interface FileSummary {
    bodyPartsCounts: number;
    fileCount: number;
    totalFileSize: number;
    sampleCount: number;
    donorCount: number;
    projectCount: number;
    primarySiteCount: number;
    primarySite: string|number;
}

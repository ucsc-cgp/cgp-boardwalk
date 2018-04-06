/**
 * UCSC Genomics Institute - CGL
 * https://cgl.genomics.ucsc.edu/
 *
 * Core files component, displays results summary as well as facets.
 */

// Core dependencies
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
// App dependencies
import { FileFacet } from "./shared/file-facet.model";
import { FileSummary } from "./file-summary/file-summary";

import {
    DownloadFileManifestAction,
    FetchFileManifestSummaryRequestAction
} from "./_ngrx/file-manifest-summary/file-manifest-summary.actions";
import { selectFileFacetsFileFacets, selectFileSummary } from "./_ngrx/file.selectors";
import { AppState } from "../_ngrx/app.state";
import { FetchFileFacetsRequestAction } from "./_ngrx/file-facet-list/file-facet-list.actions";
import { MatDialog, MatIconRegistry } from "@angular/material";
import { FileExportComponent } from "./file-export/file-export.component";
import { FireCloudDAO, FirecloudNamespace, FirecloudWorkspace } from "./file-export/fire-cloud-dao";
import { CCAlertDialogComponent } from "../shared/cc-alert-dialog/cc-alert-dialog.component";
import { DomSanitizer } from "@angular/platform-browser";
import { User } from "../data/user/user.model";
import { selectAuthenticatedUser } from "../auth/_ngrx/auth.selectors";
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
    selector: "bw-files",
    templateUrl: "files.component.html",
    styleUrls: ["files.component.scss"]
})
export class FilesComponent implements OnInit {

    // Locals
    private route: ActivatedRoute;
    private store: Store<AppState>;

    private exportDialogUp = false;
    private authenticated = false;

    // Public variables
    public selectFileSummary$: Observable<FileSummary>;
    public fileFacets$: Observable<FileFacet[]>;

    /**
     * @param route {ActivatedRoute}
     * @param store {Store<AppState>}
     */
    constructor(route: ActivatedRoute,
                store: Store<AppState>,
                private dialog: MatDialog,
                private fireCloudDAO: FireCloudDAO,
                private iconRegistry: MatIconRegistry,
                private sanitizer: DomSanitizer) {

        this.route = route;
        this.store = store;
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

    onExportToFireCloud() {
        if (!this.exportDialogUp) {
            this.store.select(selectAuthenticatedUser).take(1).subscribe((user: User) => {
                if (!user || !user.email) {
                    this.dialog.open(CCAlertDialogComponent, {
                        data: {
                            title: "Login Required",
                            message: "You must be logged in before you can export data to FireCloud."
                        }
                    });
                }
                else {
                    this.exportDialogUp = true;
                    const fetchNamespaces = this.fireCloudDAO.fetchNamespaces();
                    const fetchWorkspaces = this.fireCloudDAO.fetchWorkspaces();
                    forkJoin(fetchNamespaces, fetchWorkspaces).subscribe(results => {
                            const namespaces: FirecloudNamespace[] = results[0];
                            const workspaces: FirecloudWorkspace[] = results[1];
                            if (namespaces.length > 0 || workspaces.length > 0) {
                                const projectNames: string[] = namespaces.map(namespace => namespace.projectName);
                                const dialogRef = this.dialog.open(FileExportComponent, {
                                    data: {
                                        workspace: "",
                                        namespace: projectNames[0],
                                        namespaces: projectNames,
                                        workspaces: workspaces,
                                        store: this.store
                                    }
                                });
                                dialogRef.afterClosed().subscribe(() => this.exportDialogUp = false);
                            }
                            else {
                                const dialogRef = this.dialog.open(CCAlertDialogComponent, {
                                    data: {
                                        title: "Error",
                                        message: "You do not have any billing projects associated with your FireCloud account. You must have at least one in order to proceed."
                                    }
                                });
                                dialogRef.afterClosed().subscribe(() => this.exportDialogUp = false);
                            }
                        },
                        () => {
                            const dialogRef = this.dialog.open(CCAlertDialogComponent, {
                                data: {
                                    title: "Error",
                                    message: "There was an error retrieving information from FireCloud. Please try again."
                                }
                            });
                            dialogRef.afterClosed().subscribe(() => this.exportDialogUp = false);
                        });
                }
            });
        }
    }

    /**
     * Life cycle hooks
     */

    /**
     * Set up selectors and request initial data set.
     */
    public ngOnInit() {

        // File Summary
        this.selectFileSummary$ = this.store.select(selectFileSummary);

        // File Facets
        this.fileFacets$ = this.store.select(selectFileFacetsFileFacets);

        // Initialize the filter state from the params in the route.
        this.initQueryParams();

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

                if (params && params["filters"] && params["filters"].length) {
                    return {
                        filters: JSON.parse(decodeURIComponent(params["filters"]))
                    };
                }
                else {
                    return {};
                }
            })
            .subscribe((query) => {
                this.store.dispatch(new FetchFileFacetsRequestAction());
            });
    }

}

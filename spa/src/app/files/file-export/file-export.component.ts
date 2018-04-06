import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatRadioChange, MatSelectChange } from "@angular/material";
import { selectSelectedFileFacets } from "../_ngrx/file.selectors";
import { Store } from "@ngrx/store";
import { AppState } from "../../_ngrx/app.state";
import { FilesService } from "../shared/files.service";
import { FireCloudDAO, FirecloudWorkspace } from "./fire-cloud-dao";

@Component({
    selector: "bw-file-export",
    templateUrl: "./file-export.component.html",
    styleUrls: ["./file-export.component.css"]
})

export class FileExportComponent implements OnInit {

    public exporting = false;
    public exported = false;
    public errorMessage: string;
    public firecloudUrl: string;
    private store: Store<AppState>;
    public filteredWorkspaces: FirecloudWorkspace[] = [];
    public workspaceType: "new" | "existing" = "new";
    private newWorkspace = "";
    private billingProjects: string[];
    private canCreateWorkspace: boolean;

    constructor(public dialogRef: MatDialogRef<FileExportComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any,
                private fireCloudDAO: FireCloudDAO,
                private filesService: FilesService) {
        this.store = data.store;
        this.billingProjects = this.calculateBillingProjects(data.namespaces, data.workspaces);
        this.setupForBillingProject();
    }

    ngOnInit() {
    }

    onClose() {
        this.dialogRef.close();
    }

    onExport() {
        this.exporting = true;
        this.errorMessage = null;
        this.store.select(selectSelectedFileFacets).take(1).subscribe(selectedFacets => {
            this.filesService.exportToFireCloud(selectedFacets, this.data.workspace, this.data.namespace).subscribe(
                (fcUrl) => {
                    this.exporting = false;
                    this.exported = true;
                    this.firecloudUrl = fcUrl;
                },
                (error: any) => {
                    this.errorMessage = (error && error.message) || error || "Unknown error";
                    this.exporting = false;
                }
            );
        });
    }

    onBillingProjectChanged($event: MatSelectChange) {
        this.setupForBillingProject();
    }

    onWorkspaceTypeChanged($event: MatRadioChange) {
        if (this.workspaceType === "existing") {
            this.newWorkspace = this.data.workspace;
            this.data.workspace = this.filteredWorkspaces.length > 0 ? this.filteredWorkspaces[0].workspace.name : "";
        }
        else {
            this.data.workspace = this.newWorkspace;
        }
    }

    private filterWorkspaces(workspaces, namespace: string) {
        return workspaces.filter(workspace => workspace.workspace.namespace
            === namespace).sort((a, b) => a.workspace.name.toLocaleLowerCase().localeCompare(
                b.workspace.name.toLocaleLowerCase()));
    }

    /**
     * Calculates all the billing projects where there is write and/or owner access.
     * This is the billing projects you are part of, as well as the namespaces of projects
     * that have been shared with you.
     * @param {string[]} ownNamespaces
     * @param {FirecloudWorkspace[]} workspaces all workspaces that you have access to
     * @returns {string[]} an array of namespaces that you can write to.
     */
    private calculateBillingProjects(ownNamespaces: string[], workspaces: FirecloudWorkspace[]): string[] {
        const projectsFromWorkspaces = workspaces
            .filter(
                workspace => (workspace.accessLevel === "OWNER" || workspace.accessLevel === "WRITER")
                    && (!ownNamespaces.find(n => n === workspace.workspace.namespace)))
            .map(workspace => workspace.workspace.namespace)
            .reduce((acc: string[], value) => {
                if (!acc.includes(value)) {
                    acc.push(value);
                }
                return acc;
            }, []);
        return [].concat(ownNamespaces).concat(projectsFromWorkspaces);
    }

    private setupForBillingProject() {
        this.filteredWorkspaces = this.filterWorkspaces(this.data.workspaces, this.data.namespace);
        this.canCreateWorkspace = this.data.namespaces.includes(this.data.namespace);
        if (!this.canCreateWorkspace) {
            this.workspaceType = "existing";
        }
        if (this.workspaceType === "existing") {
            this.data.workspace = this.filteredWorkspaces.length > 0 ? this.filteredWorkspaces[0].workspace.name : "";
        }
    }
}

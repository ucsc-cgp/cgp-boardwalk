import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { selectExportFileState } from "../_ngrx/file.selectors";
import { FileExportManifestState } from "../_ngrx/file-export/file-export.state";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import { AppState } from "../../_ngrx/app.state";
import { Subscription } from "rxjs/Subscription";
import { FileExportManifestRequestAction } from "../_ngrx/file-export/file-export.actions";

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
    private exportManifest$: Observable<FileExportManifestState>;
    private store: Store<AppState>;
    private manifestSubscription: Subscription;

    constructor(public dialogRef: MatDialogRef<FileExportComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any) {
        this.exportManifest$ = data.exportManifest$;
        this.store = data.store;
    }

    ngOnInit() {
    }

    onClose() {
        if (this.manifestSubscription) {
            this.manifestSubscription.unsubscribe();
        }
        this.dialogRef.close();
    }

    onExport() {
        this.exporting = true;
        this.errorMessage = null;
        this.exportManifest$ = this.store.select(selectExportFileState);
        this.manifestSubscription = this.exportManifest$.subscribe(state => {
            if (state.status === "success") {
                this.manifestSubscription.unsubscribe();
                this.manifestSubscription = null;
                this.exporting = false;
                this.exported = true;
                this.firecloudUrl = state.fireCloudUrl;
            }
            else if (state.status === "error") {
                this.errorMessage = state.statusMessage;
                this.exporting = false;
            }
        });
        this.store.dispatch(new FileExportManifestRequestAction({name: this.data.workspace, namespace: this.data.namespace}));

    }
}

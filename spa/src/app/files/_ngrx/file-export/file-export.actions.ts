import { Action } from "@ngrx/store";
import { WorkspaceDescriptor } from "./file-export.state";

export class FileExportManifestRequestAction implements Action {
    public static ACTION_TYPE = "FILE.MANIFEST_EXPORT_REQUEST";
    public readonly type = FileExportManifestRequestAction.ACTION_TYPE;
    constructor(public payload: WorkspaceDescriptor) {
    }
}

export class FileExportManifestSuccessAction implements Action {
    public static ACTION_TYPE = "FILE.MANIFEST_EXPORT_SUCCESS";
    public readonly type = FileExportManifestSuccessAction.ACTION_TYPE;
    constructor(public fireCloudUrl: string) {
    }
}

export class FileExportManifestErrorAction implements Action {
    public static ACTION_TYPE = "FILE.MANIFEST_EXPORT_ERROR";
    public readonly type = FileExportManifestErrorAction.ACTION_TYPE;
    constructor(public errorReason: string) {
    }
}

export type All = FileExportManifestRequestAction
    | FileExportManifestSuccessAction
    | FileExportManifestErrorAction;
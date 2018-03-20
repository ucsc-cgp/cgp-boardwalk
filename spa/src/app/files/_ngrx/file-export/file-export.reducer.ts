import { Action } from "@ngrx/store";
import {
    FileExportManifestRequestAction, FileExportManifestErrorAction,
    FileExportManifestSuccessAction
} from "./file-export.actions";
import { FileExportManifestState } from "./file-export.state";

export function reducer(state: FileExportManifestState = FileExportManifestState.getDefaultState(), action: Action): FileExportManifestState {
    switch (action.type) {
        case FileExportManifestSuccessAction.ACTION_TYPE: {
            return new FileExportManifestState((action as FileExportManifestSuccessAction).fireCloudUrl, "success");
        }
        case FileExportManifestErrorAction.ACTION_TYPE: {
            return new FileExportManifestState(null, "error",
                (action as FileExportManifestErrorAction).errorReason);
        }
        case FileExportManifestRequestAction.ACTION_TYPE: {
            return new FileExportManifestState(null, "request");
        }
        default:
            return state;
    }
}
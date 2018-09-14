export interface WorkspaceDescriptor {
    name: string;
    namespace: string;
}

export type FileExportManifestStatus = "request" | "success" | "error" | null;

// export interface FileExportStatus
export class FileExportManifestState {
    constructor(public fireCloudUrl = "",
                public status: FileExportManifestStatus = null,
                public statusMessage = "") {
    }

    public static getDefaultState() {
        return new FileExportManifestState();
    }

}
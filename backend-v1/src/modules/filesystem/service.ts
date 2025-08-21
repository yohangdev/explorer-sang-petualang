import { getDirectoryTree, getFiles } from "./repository";

export abstract class FilesystemService {
    static async getDirectoryTree(parentId?: string, maxDepth?: number) {
        const rows = await getDirectoryTree({ parentId, maxDepth });
        return { nodes: rows };
    }

    static async getFiles(directoryId?: string) {
        const rows = await getFiles({ directoryId });
        return { files: rows };
    }
}
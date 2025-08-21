import { getDirectoryTree } from "./repository";

export abstract class Filesystem {
    static async getDirectoryTreeService(parentId?: string, maxDepth?: number) {
        const rows = await getDirectoryTree({ parentId, maxDepth })
        return { nodes: rows }
    }
}
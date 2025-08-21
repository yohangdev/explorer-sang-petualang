import { db } from '../../database/db';
import { directoriesTable } from '../../database/schema';
import { sql } from 'drizzle-orm'

export async function getDirectoryTree({ parentId, maxDepth }: { parentId?: string, maxDepth?: number }) {
    let whereParent = sql`parent_id IS NULL`;

    if (typeof parentId === 'string') {
        whereParent = sql`parent_id = ${parentId}`
    }

    let depthLimit = sql``;
    if (typeof maxDepth === 'number') {
        depthLimit = sql`AND ft.depth < ${maxDepth}`
    }

    const query = sql`
        WITH RECURSIVE directory_tree AS (
            -- anchor
            SELECT f.id,
                   f.name,
                   f.parent_id,
                   0::int AS depth
            FROM ${directoriesTable} f
            WHERE ${whereParent}

            UNION ALL
            -- recursive member
            SELECT c.id,
                   c.name,
                   c.parent_id,
                   ft.depth + 1
            FROM ${directoriesTable} c
                     JOIN directory_tree ft ON c.parent_id = ft.id
            ${depthLimit}
            )

        SELECT id, name, parent_id, depth
        FROM directory_tree
        ORDER BY depth ASC, name ASC, id ASC
    `

    const result = await db.execute(query);

    return result.rows
}

export async function getFiles({ directoryId }: { directoryId?: string }) {
    const query = sql`
        SELECT id, name, size_bytes, mime_type, extension,
               TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSOF') AS created_at,
               TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSOF') AS updated_at
        FROM files
        WHERE directory_id = ${directoryId}
        ORDER BY name ASC
    `

    const result = await db.execute(query);

    return result.rows
}

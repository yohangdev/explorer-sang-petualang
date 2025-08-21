import { Elysia, t } from 'elysia';
import { Filesystem } from "./service";

export const filesystem = new Elysia({ prefix: '/api/v1/filesystem' })
    .get('/tree', async ({ query }) => {
        const { parentId, maxDepth } = query
        return await Filesystem.getDirectoryTreeService(parentId, maxDepth)
    }, {
        query: t.Object({
            parentId: t.Optional(t.String({ format: 'uuid' })),
            maxDepth: t.Optional(t.Integer({ minimum: 0, maximum: 32 }))
        }),
        response: {
            200: t.Object({
                nodes: t.Array(t.Object({
                    id: t.String({ format: 'uuid' }),
                    name: t.String(),
                    parent_id: t.Union([t.String({ format: 'uuid' }), t.Null()]),
                    depth: t.Integer({ minimum: 0 })
                }))
            }),
        },
        detail: {
            summary: 'Get directories tree',
            tags: ['Filesystem']
        }
    })
import {Elysia} from "elysia";
import {swagger} from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'Explorer Sang Petualang API',
                description: 'Explorer Sang Petualang API description',
                version: '1.0.0'
            },
        }
    }))
    .get("/up", () => "Application is running.", {
        detail: {
            summary: 'Get application health status.',
            tags: ['App']
        }
    })
    .listen(8080);

console.log(`🦊 Backend Service v1 is running at ${app.server?.hostname}:${app.server?.port}`);

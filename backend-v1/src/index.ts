import {Elysia} from "elysia";
import {swagger} from '@elysiajs/swagger';
import {filesystem} from "./modules/filesystem";
import { cors } from "@elysiajs/cors";

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
    .get("/", () => "Application is running.", {
        detail: {
            summary: 'Get application health status.',
            tags: ['App']
        }
    })
    .use(filesystem)
    .use(cors())
    .listen(8080);

console.log(`🦊 Backend Service v1 is running at ${app.server?.hostname}:${app.server?.port}`);

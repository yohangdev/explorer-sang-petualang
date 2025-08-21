import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('return a response', async () => {
        const app = new Elysia().get('/', () => 'Application is running.')

        const response = await app
            .handle(new Request('http://localhost:8080'))
            .then((res) => res.text())

        expect(response).toBe('Application is running.')
    })
})
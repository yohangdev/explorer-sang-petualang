import { t } from 'elysia'

export namespace FilesystemModel {

    export const directoryTreeResponse = t.Object({
        status: t.String(),
    })

    export type directoryTreeResponse = typeof directoryTreeResponse.static
}
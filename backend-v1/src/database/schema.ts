import { relations } from "drizzle-orm";
import {pgTable, varchar, uuid, timestamp, index, foreignKey, integer} from "drizzle-orm/pg-core";

export const directoriesTable = pgTable("directories", {
    id: uuid().primaryKey().notNull(),
    parentId: uuid("parent_id"),
    name: varchar().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
    index("directories_parent_id_idx").using("btree", table.parentId),
    foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
        name: "directories_parent_id_fkey"
    }).onDelete("cascade"),
]);

export const filesTable = pgTable("files", {
    id: uuid().primaryKey().notNull(),
    directoryId: uuid("directory_id").notNull(),
    name: varchar().notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    mimeType: varchar("mime_type").notNull(),
    extension: varchar("extension").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
    index("directories_id_idx").using("btree", table.directoryId),
    foreignKey({
        columns: [table.directoryId],
        foreignColumns: [directoriesTable.id],
        name: "directories_id_fkey"
    }).onDelete("cascade"),
]);

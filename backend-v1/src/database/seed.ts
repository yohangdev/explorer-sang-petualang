import 'dotenv/config';
import { db } from './db';
import * as schema from './schema';
import { v7 as uuidv7 } from 'uuid';
import { reset } from 'drizzle-seed';

const ROOT_NAME = 'My Drive';
const TOP_LEVEL_COUNT = 10;
const SECOND_LEVEL_COUNT = 10;
const THIRD_LEVEL_COUNT = 10;

async function createRoot(): Promise<string> {
    const id = uuidv7();
    const now = new Date();
    await db.insert(schema.directoriesTable).values({ id, name: ROOT_NAME, parentId: null, createdAt: now, updatedAt: now });
    return id;
}

async function createDirectory(id: string, name: string, parentId: string | null) {
    const now = new Date();
    await db.insert(schema.directoriesTable).values({ id, name: name, parentId: parentId, createdAt: now, updatedAt: now });
    return id;
}

async function seedProcess() {
    const rootId = await createRoot();
    const idByPath = new Map<string, string>();
    idByPath.set('', rootId);

    for (let i = 1; i <= TOP_LEVEL_COUNT; i++) {
        const path1 = `${i}`;
        const id1 = uuidv7();
        const name1 = `Directory ${path1}`;
        const ins1 = await createDirectory(id1, name1, rootId);
        idByPath.set(path1, ins1);

        for (let j = 1; j <= SECOND_LEVEL_COUNT; j++) {
            const path2 = `${i}.${j}`;
            const id2 = uuidv7();
            const name2 = `Directory ${path2}`;
            const parent2 = idByPath.get(`${i}`)!;
            const ins2 = await createDirectory(id2, name2, parent2);
            idByPath.set(path2, ins2);

            for (let k = 1; k <= THIRD_LEVEL_COUNT; k++) {
                const path3 = `${i}.${j}.${k}`;
                const id3 = uuidv7();
                const name3 = `Directory ${path3}`;
                const parent3 = idByPath.get(`${i}.${j}`)!;
                const ins3 = await createDirectory(id3, name3, parent3);
                idByPath.set(path3, ins3);
            }
        }
    }
}

async function main() {
    console.log('Reset data.');
    await reset(db, schema);

    await seedProcess();
    console.log('Seeded directories data.');
    process.exit(0);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})

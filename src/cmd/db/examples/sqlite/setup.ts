const dependencies = ['drizzle-orm', 'better-sqlite3']
const devDependencies = ['drizzle-kit']

const init = `./db/examples/sqlite/index.ts`
const drizzleKit = `./db/examples/sqlite/drizzle.config.ts`
const schema = `./db/examples/sqlite/schema.ts`


export const sqlite = { init, schema, drizzleKit, dependencies, devDependencies }